'use client';

import { useEffect, useRef } from 'react';

/* The hero's one authored signature moment: a raw-WebGL procedural aura —
   slow domain-warped noise, colorized from near-black to the brass accent,
   drifting toward the pointer — sitting behind the name. No textures, no
   dependency: a single fullscreen triangle and a fragment shader.

   Falls back to a static CSS radial gradient (rendered by the parent, see
   Hero.tsx) when WebGL is unavailable or the visitor prefers reduced motion. */

const VERT = `#version 100
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 100
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uAccent;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p *= 2.02;
    amp *= 0.52;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;

  vec2 mouseOffset = (uMouse - 0.5) * 0.18;
  float t = uTime * 0.045;

  vec2 warp = p * 1.6 + mouseOffset;
  warp.x += fbm(p * 2.2 + t) * 0.7;
  warp.y += fbm(p * 2.2 - t) * 0.7;

  float n = fbm(warp + t * 0.5);
  n = smoothstep(0.18, 0.92, n);

  float centerDist = length((uv - vec2(0.5, 0.42)) * vec2(uResolution.x / uResolution.y, 1.0));
  float vignette = smoothstep(0.95, 0.1, centerDist);

  float glow = n * vignette;
  vec3 color = mix(vec3(0.0), uAccent, glow * 0.85);

  gl_FragColor = vec4(color, glow * 0.9);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroAura({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uAccent = gl.getUniformLocation(program, 'uAccent');

    // Read the accent straight from the token, not a hardcoded float triplet,
    // so a future theme swap in globals.css retints this shader too.
    const accentHex = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent')
      .trim() || '#c9a24b';
    const hexMatch = accentHex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    const [r, g, b] = hexMatch
      ? [parseInt(hexMatch[1], 16) / 255, parseInt(hexMatch[2], 16) / 255, parseInt(hexMatch[3], 16) / 255]
      : [0.788, 0.635, 0.294];
    gl.uniform3f(uAccent, r, g, b);

    let mouse = { x: 0.5, y: 0.45 };
    let targetMouse = { x: 0.5, y: 0.45 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    };
    window.addEventListener('pointermove', onPointerMove);

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const start_ = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      // One static frame — no loop, no listener, no continuous cost.
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.45);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return () => {
        ro.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(posBuffer);
      };
    }

    // The hero is the only place this shader is visible, but a naive rAF loop
    // keeps painting it every frame for the rest of the session — real GPU
    // cost fighting the scroll compositor site-wide. Gate the loop to only
    // run while the canvas is actually on screen (plus a margin so it's warm
    // before the hero fully arrives), and pause on tab visibility too.
    let isIntersecting = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && document.visibilityState === 'visible') start_();
        else stop();
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') stop();
      else if (isIntersecting) start_();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(posBuffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

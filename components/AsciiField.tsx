'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_IDS } from '@/hooks/useActiveSection';
import { buildGlyphAtlas, GLYPH_RAMP, GLYPH_CELL_W, GLYPH_CELL_H } from '@/components/ascii-field/atlas';
import { VERT, buildFragmentShader } from '@/components/ascii-field/shaders';
import { MASK_HALF_WIDTH_BY_INDEX, GLYPH_MIX_BY_INDEX } from '@/components/ascii-field/theme';

/* The page's one shared background: a fixed full-viewport WebGL layer.

   On the hero it is the smooth brass smoke the standalone HeroAura used to
   draw. On every section below it is a live ASCII field — a full-viewport
   procedural pattern quantized to a glyph ramp, one per section (see
   ascii-field/fields.ts). The hero dissolving from smoke into type is the
   transition between those two modes.

   The cross-fade between fields is driven by SCROLL POSITION, not by a section
   -change event, so it follows the scroll curve exactly and can't jump. That
   is also why this loop does not freeze during the section-to-section scroll
   animation — the morph has to be visible during exactly that window. It still
   idles on IntersectionObserver and tab visibility.

   This component lives in the root layout, so it stays mounted across route
   changes and its setup effect runs exactly once for the life of the tab.
   Everything that depends on the current route therefore has to come in
   through a ref (see the pathname effect below), and every cached measurement
   has to be invalidated on navigation. */

/* Glyph cell in CSS pixels. The ratio has to match GLYPH_CELL_W/H in atlas.ts
   or characters sample stretched; the absolute size is the readability knob —
   smaller reads as noise, larger reads as a wall of text. */
const GRID_CELL_W = 12;
const GRID_CELL_H = GRID_CELL_W * (GLYPH_CELL_H / GLYPH_CELL_W);

/* How far either side of a section boundary the cross-fade runs, as a fraction
   of viewport height. 0.4 means the blend covers 80% of a section-to-section
   scroll and each section still settles on a pure field for the rest of its
   extent. Smaller reads as a cut; larger and no section ever fully arrives at
   its own field. */
const BLEND_FRACTION = 0.4;

/* Routes other than the one scrolling page. Only the hero is ever smoke, so a
   subpage borrows a section's ASCII field — a case study is a project, the
   gallery hangs off hobbies. `maskHalfWidth` is half that route's own content
   column in px, which is not the same as the borrowed section's. */
type RouteField = { section: string; maskHalfWidth: number };

const ROUTE_FIELDS: Array<{ matches: (pathname: string) => boolean; field: RouteField }> = [
  { matches: (p) => p.startsWith('/projects/'), field: { section: 'projects', maskHalfWidth: 448 } },
  { matches: (p) => p === '/gallery', field: { section: 'hobbies', maskHalfWidth: 576 } },
];

const FALLBACK_ROUTE_FIELD: RouteField = { section: 'about', maskHalfWidth: 512 };

function routeField(pathname: string): RouteField {
  return ROUTE_FIELDS.find((entry) => entry.matches(pathname))?.field ?? FALLBACK_ROUTE_FIELD;
}

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

function readRgb(varName: string, fallback: [number, number, number]): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  const match = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!match) return fallback;
  return [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];
}

export default function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  /* Which field a route with no scrolling sections should hold, and the
     re-measure hook the setup effect publishes. Refs because the setup effect
     runs once and can't close over a changing pathname. */
  const staticFieldRef = useRef(SECTION_IDS.indexOf(FALLBACK_ROUTE_FIELD.section));
  const staticMaskRef = useRef(FALLBACK_ROUTE_FIELD.maskHalfWidth);
  const remeasureRef = useRef<(() => void) | null>(null);

  /* Declared before the setup effect so the first render's values are already
     in place when that effect takes its initial measurement.

     Re-measuring here is what fixes the stale-geometry bug: the section
     tops/bottoms are cached, and a client-side navigation to a case study and
     back changes the whole document without necessarily resizing the canvas,
     so nothing else would have invalidated them. */
  useEffect(() => {
    const field = routeField(pathname);
    staticFieldRef.current = SECTION_IDS.indexOf(field.section);
    staticMaskRef.current = field.maskHalfWidth;
    remeasureRef.current?.();
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, buildFragmentShader());
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uAspect = gl.getUniformLocation(program, 'uAspect');
    const uGridSize = gl.getUniformLocation(program, 'uGridSize');
    const uAtlas = gl.getUniformLocation(program, 'uAtlas');
    const uRampCount = gl.getUniformLocation(program, 'uRampCount');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uFieldA = gl.getUniformLocation(program, 'uFieldA');
    const uFieldB = gl.getUniformLocation(program, 'uFieldB');
    const uTransition = gl.getUniformLocation(program, 'uTransition');
    const uProjectsProgress = gl.getUniformLocation(program, 'uProjectsProgress');
    const uInk = gl.getUniformLocation(program, 'uInk');
    const uAccent = gl.getUniformLocation(program, 'uAccent');
    const uGlyphMix = gl.getUniformLocation(program, 'uGlyphMix');
    const uMaskHalfWidth = gl.getUniformLocation(program, 'uMaskHalfWidth');
    const uMaskHalfHeight = gl.getUniformLocation(program, 'uMaskHalfHeight');

    gl.uniform1f(uRampCount, GLYPH_RAMP.length);
    gl.uniform1f(uMaskHalfHeight, 0.42);

    // Both colours come from tokens, never a literal, so a theme swap in
    // globals.css retints the shader too.
    const [ir, ig, ib] = readRgb('--color-field', [0.318, 0.298, 0.243]);
    gl.uniform3f(uInk, ir, ig, ib);
    const [ar, ag, ab] = readRgb('--color-accent', [0.788, 0.635, 0.294]);
    gl.uniform3f(uAccent, ar, ag, ab);

    // Glyph atlas texture — baked once from a Canvas2D offscreen canvas, never
    // per-frame. Built immediately with a generic fallback so first paint
    // isn't delayed, then rebuilt once when the mono webfont actually loads.
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const uploadAtlas = (fontFamily: string) => {
      const atlasCanvas = buildGlyphAtlas(fontFamily);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
    };

    const monoVar = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
    uploadAtlas(monoVar || 'monospace');
    if (document.fonts?.ready) {
      document.fonts.ready
        .then(() => uploadAtlas(monoVar || 'monospace'))
        .catch(() => {});
    }
    gl.uniform1i(uAtlas, 0);

    let mouse = { x: 0.5, y: 0.45 };
    let targetMouse = { x: 0.5, y: 0.45 };
    let pointerActive = false;

    const onPointerMove = (e: PointerEvent) => {
      targetMouse = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
    };
    /* Cursor-follow drift is home-only. Called every frame, so it early-outs
       unless the answer actually changed. */
    const syncPointerListener = (shouldListen: boolean) => {
      if (shouldListen === pointerActive) return;
      if (shouldListen) window.addEventListener('pointermove', onPointerMove, { passive: true });
      else window.removeEventListener('pointermove', onPointerMove);
      pointerActive = shouldListen;
    };

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    /* Section geometry, the viewport height the blend window is derived from,
       and the CSS-pixel width the mask half-width is expressed against.
       Measured only on navigation / resize / ResizeObserver / fonts.ready —
       never on the rAF or wheel hot path, where reading offsetTop forces a
       reflow. */
    const lastIndex = SECTION_IDS.length - 1;
    const projectsIndex = SECTION_IDS.indexOf('projects');
    let sectionTops = SECTION_IDS.map(() => 0);
    let sectionBottoms = SECTION_IDS.map(() => 1);
    let hasSections = false;
    let blendWindow = 1;
    let viewportHeight = 1;
    let cssWidth = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rect.width);
      viewportHeight = Math.max(1, rect.height);
      blendWindow = Math.max(1, viewportHeight * BLEND_FRACTION);

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uAspect, canvas.width / canvas.height);

      // Grid derived from a fixed CSS cell size, so glyphs stay the same size
      // on screen at any viewport — a fixed column count made them shrink to
      // noise on a wide monitor.
      const cols = Math.max(8, Math.round(rect.width / GRID_CELL_W));
      const rows = Math.max(6, Math.round(rect.height / GRID_CELL_H));
      gl.uniform2f(uGridSize, cols, rows);

      const elements = SECTION_IDS.map((id) => document.getElementById(id));
      hasSections = elements.some(Boolean);
      sectionTops = elements.map((el) => el?.offsetTop ?? 0);
      sectionBottoms = elements.map(
        (el) => (el?.offsetTop ?? 0) + Math.max(1, el?.offsetHeight ?? 1)
      );
    };

    /* Which two fields are showing and how far between them, purely as a
       function of where the viewport centre sits relative to the section
       boundaries. Reused object rather than a fresh one per frame.

       This replaced an event-driven state machine that started the morph when
       useActiveSection changed — roughly halfway through the scroll — and then
       had the scroll-end event snap it to completion, so the field visibly cut
       rather than dissolved. Nothing here depends on React state, so a section
       change no longer re-renders the component either. */
    const fieldState = { a: 0, b: 0, eased: 0, maskHalfWidth: 512 };
    const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

    const computeFieldState = (scrollY: number) => {
      // A route with none of the scrolling sections in it (/gallery,
      // /projects/[id]) holds that route's own field. Keyed off the measured
      // DOM rather than the pathname so the two can't disagree mid-navigation.
      if (!hasSections) {
        fieldState.a = staticFieldRef.current;
        fieldState.b = staticFieldRef.current;
        fieldState.eased = 0;
        fieldState.maskHalfWidth = staticMaskRef.current;
        return fieldState;
      }

      const center = scrollY + viewportHeight / 2;
      let index = 0;
      for (let k = lastIndex; k >= 0; k--) {
        if (center >= sectionTops[k]) {
          index = k;
          break;
        }
      }

      let a = index;
      let b = index;
      let t = 0;
      const fromStart = center - sectionTops[index];
      const toEnd = sectionBottoms[index] - center;
      if (index > 0 && fromStart < blendWindow) {
        // Still arriving: blend up from the section above.
        a = index - 1;
        b = index;
        t = 0.5 + 0.5 * (fromStart / blendWindow);
      } else if (index < lastIndex && toEnd < blendWindow) {
        // Leaving: blend down into the section below.
        a = index;
        b = index + 1;
        t = 0.5 - 0.5 * (toEnd / blendWindow);
      }
      t = Math.min(1, Math.max(0, t));

      const eased = t * t * (3 - 2 * t);
      fieldState.a = a;
      fieldState.b = b;
      fieldState.eased = eased;
      fieldState.maskHalfWidth = lerp(
        MASK_HALF_WIDTH_BY_INDEX[a] ?? 512,
        MASK_HALF_WIDTH_BY_INDEX[b] ?? 512,
        eased
      );
      return fieldState;
    };

    const applyScrollUniforms = (scrollY: number) => {
      const { a, b, eased, maskHalfWidth } = computeFieldState(scrollY);

      gl.uniform1f(uFieldA, a);
      gl.uniform1f(uFieldB, b);
      gl.uniform1f(uTransition, a === b ? 0 : eased);
      gl.uniform1f(uMaskHalfWidth, maskHalfWidth / cssWidth);
      gl.uniform1f(
        uGlyphMix,
        lerp(GLYPH_MIX_BY_INDEX[a] ?? 1, GLYPH_MIX_BY_INDEX[b] ?? 1, eased)
      );

      const projectsTop = sectionTops[projectsIndex];
      const projectsHeight = Math.max(1, sectionBottoms[projectsIndex] - projectsTop);
      const progress = hasSections
        ? Math.min(1, Math.max(0, (scrollY - projectsTop) / projectsHeight))
        : 1;
      gl.uniform1f(uProjectsProgress, progress);

      return a === 0 || b === 0;
    };

    /* The single frame the reduced-motion path draws. It has to be re-issued
       after any re-measure, because setting canvas.width clears the drawing
       buffer and there is no loop to paint it again. */
    const renderStatic = () => {
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uMouse, 0.5, 0.45);
      applyScrollUniforms(window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const onGeometryChange = () => {
      resize();
      if (reduceMotion) renderStatic();
    };

    resize();
    remeasureRef.current = onGeometryChange;

    const canvasRo = new ResizeObserver(onGeometryChange);
    canvasRo.observe(canvas);
    // Body too, same as SmoothSectionScroll: a section growing or the document
    // changing height moves every boundary below it, and neither resizes the
    // fixed canvas.
    const bodyRo = new ResizeObserver(onGeometryChange);
    bodyRo.observe(document.body);
    if (document.fonts?.ready) document.fonts.ready.then(onGeometryChange).catch(() => {});

    const start = performance.now();
    const draw = (now: number) => {
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);

      syncPointerListener(applyScrollUniforms(window.scrollY));

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

    const dispose = () => {
      remeasureRef.current = null;
      canvasRo.disconnect();
      bodyRo.disconnect();
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(posBuffer);
    };

    if (reduceMotion) {
      // One static frame for wherever the page happens to be — no loop, no
      // listeners, no motion of any kind.
      renderStatic();
      return dispose;
    }

    let isIntersecting = false;
    const sync = () => {
      if (isIntersecting && document.visibilityState === 'visible') start_();
      else stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        sync();
      },
      { rootMargin: '0px' }
    );
    io.observe(canvas);

    const onVisibilityChange = () => sync();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      syncPointerListener(false);
      dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden h-full w-full md:block"
    />
  );
}

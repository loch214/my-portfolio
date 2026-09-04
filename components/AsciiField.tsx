'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_IDS } from '@/hooks/useActiveSection';
import {
  buildGlyphAtlas,
  resolveRamps,
  RAMP_LEN,
  GLYPH_CELL_W,
  GLYPH_CELL_H,
} from '@/components/ascii-field/atlas';
import { VERT, buildFragmentShader } from '@/components/ascii-field/shaders';
import {
  FIELD_LEVELS,
  MASK_HALF_WIDTH_BY_INDEX,
  WARMTH_BY_INDEX,
  MASK_HALF_HEIGHT_FRACTION,
  HERO_MASK_PADDING_X,
  HERO_MASK_PADDING_Y,
  HERO_INDEX,
} from '@/components/ascii-field/theme';

/* The page's one shared background: a fixed full-viewport WebGL layer.

   Every section, hero included, is a live ASCII field — a full-viewport
   procedural pattern quantized to a glyph ramp (see ascii-field/fields.ts).
   The hero is the one that answers the pointer: its glyphs densify and warm
   toward the brass accent around the cursor, so the first viewport is the most
   alive background on the site without leaving the glyph system. Until a real
   mouse moves, and on touch, that focus sweeps on its own.

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

/* Routes other than the one scrolling page borrow a section's field — a case
   study is a project, the gallery hangs off hobbies. Never the hero's: that one
   is built around a cursor halo sized to the hero's own headline, which no
   other page has. `maskHalfWidth` is half that route's own content column in
   px, which is not the same as the borrowed section's. */
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
    const uAtlasRows = gl.getUniformLocation(program, 'uAtlasRows');
    const uFieldGain = gl.getUniformLocation(program, 'uFieldGain');
    const uFieldBias = gl.getUniformLocation(program, 'uFieldBias');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uFieldA = gl.getUniformLocation(program, 'uFieldA');
    const uFieldB = gl.getUniformLocation(program, 'uFieldB');
    const uTransition = gl.getUniformLocation(program, 'uTransition');
    const uProjectsProgress = gl.getUniformLocation(program, 'uProjectsProgress');
    const uInk = gl.getUniformLocation(program, 'uInk');
    const uAccent = gl.getUniformLocation(program, 'uAccent');
    const uWarmth = gl.getUniformLocation(program, 'uWarmth');
    const uMaskCenter = gl.getUniformLocation(program, 'uMaskCenter');
    const uMaskHalfWidth = gl.getUniformLocation(program, 'uMaskHalfWidth');
    const uMaskHalfHeight = gl.getUniformLocation(program, 'uMaskHalfHeight');

    gl.uniform1f(uRampCount, RAMP_LEN);
    gl.uniform1f(uAtlasRows, SECTION_IDS.length);

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

    /* One row per section, so which characters a section is drawn in is part
       of its identity. resolveRamps probes the font first and swaps in an
       ASCII stand-in for any family it can't draw — the block, box and braille
       ramps come from the platform mono via the fallback chain, not from
       Fragment Mono itself. */
    const uploadAtlas = (fontFamily: string) => {
      const atlasCanvas = buildGlyphAtlas(fontFamily, resolveRamps(fontFamily));
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

    /* Touch is excluded on purpose: a touch drag is a scroll gesture, and
       letting it move the halo yanked the focus around while the visitor was
       only trying to scroll. Touch devices keep the automatic sweep instead. */
    let pointerSeen = false;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointerSeen = true;
      targetMouse = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
    };

    /* Where the halo sits before anyone has moved a mouse — a slow figure that
       never repeats on the beat, so the hero is alive on arrival and on touch
       rather than sitting with a dead spot in the middle. */
    const sweepTarget = (nowSeconds: number) => {
      targetMouse = {
        x: 0.5 + Math.cos(nowSeconds * 0.17) * 0.27,
        y: 0.5 + Math.sin(nowSeconds * 0.23) * 0.17,
      };
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

    /* Keep-out ellipse per field: centre in viewport fractions (y measured
       from the bottom, matching gl_FragCoord), horizontal radius in CSS px,
       vertical radius as a fraction of height. Every section but the hero is a
       centred column and shares one shape; the hero's is measured off its
       actual headline, because its copy is a left-aligned block and the
       centred ellipse cleared nearly the whole screen — which left the cursor
       halo with nowhere to show. */
    let maskCx = SECTION_IDS.map(() => 0.5);
    let maskCy = SECTION_IDS.map(() => 0.5);
    let maskHalfW = SECTION_IDS.map((id) => MASK_HALF_WIDTH_BY_INDEX[SECTION_IDS.indexOf(id)] ?? 512);
    let maskHalfH = SECTION_IDS.map(() => MASK_HALF_HEIGHT_FRACTION);

    /* Offset position of an element within an ancestor, walking the
       offsetParent chain. Deliberately not getBoundingClientRect: that
       includes transforms, and CharacterReveal animates each character from
       y: 110% to 0% over ~0.9s, so a rect taken at mount reads the hero's
       copy a full line lower than where it settles. offsetLeft/offsetTop are
       layout-only and give the settled box immediately. */
    const offsetWithin = (el: HTMLElement, ancestor: HTMLElement) => {
      let x = 0;
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== ancestor) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return { x, y };
    };

    /* The hero's keep-out, measured off the copy that is actually inked.

       Element boxes are no good on their own: the <h1> is `flex flex-col`, so
       each CharacterReveal line stretches to the container's full 1072px even
       though the name only draws ~534px of it. Sizing the ellipse to that
       cleared the entire hero and left the cursor halo nowhere to show. The
       per-character spans are the real extent — they're the leaf spans, the
       line wrappers being stretched flex items — plus the intro paragraph. */
    const measureHeroMask = () => {
      const hero = document.getElementById(SECTION_IDS[HERO_INDEX]);
      if (!hero) return;

      const parts: HTMLElement[] = [];
      const heading = hero.querySelector('h1');
      if (heading) {
        const leaves = Array.from(heading.querySelectorAll<HTMLElement>('span')).filter(
          (el) => el.children.length === 0 && el.textContent?.trim()
        );
        // No per-character spans under prefers-reduced-motion, where
        // CharacterReveal renders plain text: fall back to the heading itself.
        parts.push(...(leaves.length > 0 ? leaves : [heading as HTMLElement]));
      }
      const intro = hero.querySelector<HTMLElement>('p');
      if (intro) parts.push(intro);

      let left = Infinity;
      let right = -Infinity;
      let top = Infinity;
      let bottom = -Infinity;
      parts.forEach((el) => {
        if (el.offsetWidth < 1 || el.offsetHeight < 1) return;
        const { x, y } = offsetWithin(el, hero);
        left = Math.min(left, x);
        right = Math.max(right, x + el.offsetWidth);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y + el.offsetHeight);
      });
      if (!Number.isFinite(left) || right <= left) return;

      // x within the hero is x within the viewport (the hero is full-bleed),
      // and y within the hero is y within the viewport because it is the first
      // section — so no scroll offset is involved either way.
      maskCx[HERO_INDEX] = (left + right) / 2 / cssWidth;
      maskCy[HERO_INDEX] = 1 - (top + bottom) / 2 / viewportHeight;
      maskHalfW[HERO_INDEX] = (right - left) / 2 + HERO_MASK_PADDING_X;
      maskHalfH[HERO_INDEX] = ((bottom - top) / 2 + HERO_MASK_PADDING_Y) / viewportHeight;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssWidth = Math.max(1, rect.width);
      viewportHeight = Math.max(1, rect.height);
      blendWindow = Math.max(1, viewportHeight * BLEND_FRACTION);

      const nextWidth = Math.max(1, Math.round(rect.width * dpr));
      const nextHeight = Math.max(1, Math.round(rect.height * dpr));

      /* Only assign the backing store when it actually changes — assigning
         canvas.width is a mutation even for an identical value, and it clears
         the drawing buffer. */
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      /* These, on the other hand, must be re-sent unconditionally. Uniforms
         are per-program state, and this effect can run again against the same
         canvas — React StrictMode double-invokes it in dev, and Fast Refresh
         re-runs it too. On that second run the backing store already matches,
         so guarding these behind the size check left the new program with
         uResolution, uAspect and uGridSize all still at 0 and the whole field
         rendering nothing. */
      gl.viewport(0, 0, nextWidth, nextHeight);
      gl.uniform2f(uResolution, nextWidth, nextHeight);
      gl.uniform1f(uAspect, nextWidth / nextHeight);

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

      maskCx = SECTION_IDS.map(() => 0.5);
      maskCy = SECTION_IDS.map(() => 0.5);
      maskHalfW = SECTION_IDS.map((_, i) => MASK_HALF_WIDTH_BY_INDEX[i] ?? 512);
      maskHalfH = SECTION_IDS.map(() => MASK_HALF_HEIGHT_FRACTION);
      measureHeroMask();
    };

    /* Which two fields are showing and how far between them, purely as a
       function of where the viewport centre sits relative to the section
       boundaries. Reused object rather than a fresh one per frame.

       This replaced an event-driven state machine that started the morph when
       useActiveSection changed — roughly halfway through the scroll — and then
       had the scroll-end event snap it to completion, so the field visibly cut
       rather than dissolved. Nothing here depends on React state, so a section
       change no longer re-renders the component either. */
    const fieldState = { a: 0, b: 0, eased: 0, cx: 0.5, cy: 0.5, halfW: 512, halfH: MASK_HALF_HEIGHT_FRACTION };
    const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

    const computeFieldState = (scrollY: number) => {
      // A route with none of the scrolling sections in it (/gallery,
      // /projects/[id]) holds that route's own field. Keyed off the measured
      // DOM rather than the pathname so the two can't disagree mid-navigation.
      if (!hasSections) {
        fieldState.a = staticFieldRef.current;
        fieldState.b = staticFieldRef.current;
        fieldState.eased = 0;
        fieldState.cx = 0.5;
        fieldState.cy = 0.5;
        fieldState.halfW = staticMaskRef.current;
        fieldState.halfH = MASK_HALF_HEIGHT_FRACTION;
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
      fieldState.cx = lerp(maskCx[a], maskCx[b], eased);
      fieldState.cy = lerp(maskCy[a], maskCy[b], eased);
      fieldState.halfW = lerp(maskHalfW[a], maskHalfW[b], eased);
      fieldState.halfH = lerp(maskHalfH[a], maskHalfH[b], eased);
      return fieldState;
    };

    const applyScrollUniforms = (scrollY: number) => {
      const { a, b, eased, cx, cy, halfW, halfH } = computeFieldState(scrollY);

      gl.uniform1f(uFieldA, a);
      gl.uniform1f(uFieldB, b);
      gl.uniform1f(uTransition, a === b ? 0 : eased);
      gl.uniform2f(uMaskCenter, cx, cy);
      gl.uniform1f(uMaskHalfWidth, halfW / cssWidth);
      gl.uniform1f(uMaskHalfHeight, halfH);
      gl.uniform1f(uWarmth, lerp(WARMTH_BY_INDEX[a] ?? 0, WARMTH_BY_INDEX[b] ?? 0, eased));

      const levelA = FIELD_LEVELS[a] ?? { gain: 1, bias: 0 };
      const levelB = FIELD_LEVELS[b] ?? { gain: 1, bias: 0 };
      gl.uniform1f(uFieldGain, lerp(levelA.gain, levelB.gain, eased));
      gl.uniform1f(uFieldBias, lerp(levelA.bias, levelB.bias, eased));

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
      if (!pointerSeen) sweepTarget((now - start) / 1000);
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

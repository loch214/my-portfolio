'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SECTION_IDS } from '@/hooks/useActiveSection';
import { VERT, FRAG } from '@/components/contour-field/shader';
import {
  SCROLL_PARALLAX,
  CURSOR_FOLLOW_SECONDS,
  CURSOR_FADE_SECONDS,
  MASK_HALF_WIDTH_BY_INDEX,
  MASK_FLOOR_BY_INDEX,
  ROUTE_MASK_FLOOR,
  MASK_HALF_HEIGHT_FRACTION,
  HERO_MASK_PADDING_X,
  HERO_MASK_PADDING_Y,
  HERO_INDEX,
} from '@/components/contour-field/theme';

/* The page's one shared background: a fixed full-viewport WebGL layer drawing
   a single continuous topographic map, with film grain and a soft vignette.

   Scrolling pans across the map (a pure function of scrollY), so moving from
   one section to the next is a camera move over the same terrain rather than
   a swap — there is nothing to cut. The cursor acts as a loupe: lines under it
   turn brass, thicken, and the terrain swells outward.

   It idles on IntersectionObserver and tab visibility, and does not freeze
   during SmoothSectionScroll's animation — the pan has to be visible during
   exactly that window.

   This component lives in the root layout, so it stays mounted across route
   changes and its setup effect runs exactly once for the life of the tab.
   Everything that depends on the current route therefore has to come in
   through a ref (see the pathname effect below), and every cached measurement
   has to be invalidated on navigation. */

/* How far either side of a section boundary the keep-out ellipse morphs, as a
   fraction of viewport height. The hero's mask is a left-aligned block and
   every other section's is a centred column, so the ellipse has to travel
   between them rather than jump. */
const BLEND_FRACTION = 0.4;

/* Routes other than the one scrolling page need their own keep-out width:
   half that route's content column in px. */
const ROUTE_MASKS: Array<{ matches: (pathname: string) => boolean; halfWidth: number }> = [
  { matches: (p) => p.startsWith('/projects/'), halfWidth: 448 },
  { matches: (p) => p === '/gallery', halfWidth: 576 },
];

const FALLBACK_ROUTE_MASK = 512;

function routeMask(pathname: string): number {
  return ROUTE_MASKS.find((entry) => entry.matches(pathname))?.halfWidth ?? FALLBACK_ROUTE_MASK;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
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

export default function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  /* The keep-out width a route with no scrolling sections should hold, and the
     re-measure hook the setup effect publishes. Refs because the setup effect
     runs once and can't close over a changing pathname. */
  const staticMaskRef = useRef(FALLBACK_ROUTE_MASK);
  const remeasureRef = useRef<(() => void) | null>(null);

  /* Declared before the setup effect so the first render's values are already
     in place when that effect takes its initial measurement.

     Re-measuring here fixes a real stale-geometry bug: section tops/bottoms
     are cached, and a client-side navigation to a case study and back changes
     the whole document without necessarily resizing the canvas, so nothing
     else would have invalidated them. */
  useEffect(() => {
    staticMaskRef.current = routeMask(pathname);
    remeasureRef.current?.();
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // No WebGL2 → no canvas paint at all, and the CSS ground shows through.
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
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

    // The vertex shader builds its triangle from gl_VertexID, but WebGL2 still
    // wants a bound vertex array object to draw from.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uPixelRatio = gl.getUniformLocation(program, 'uPixelRatio');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uMouseOn = gl.getUniformLocation(program, 'uMouseOn');
    const uMaskCenter = gl.getUniformLocation(program, 'uMaskCenter');
    const uMaskHalfWidth = gl.getUniformLocation(program, 'uMaskHalfWidth');
    const uMaskHalfHeight = gl.getUniformLocation(program, 'uMaskHalfHeight');
    const uMaskFloor = gl.getUniformLocation(program, 'uMaskFloor');
    const uGround = gl.getUniformLocation(program, 'uGround');
    const uInk = gl.getUniformLocation(program, 'uInk');
    const uAccent = gl.getUniformLocation(program, 'uAccent');

    // All three colours come from tokens, never a literal, so a theme swap in
    // globals.css retints the shader too.
    const setColours = () => {
      const [gr, gg, gb] = readRgb('--color-bg', [0.071, 0.067, 0.063]);
      gl.uniform3f(uGround, gr, gg, gb);
      const [ir, ig, ib] = readRgb('--color-field', [0.4, 0.369, 0.302]);
      gl.uniform3f(uInk, ir, ig, ib);
      const [ar, ag, ab] = readRgb('--color-accent', [0.788, 0.635, 0.294]);
      gl.uniform3f(uAccent, ar, ag, ab);
    };
    setColours();

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    /* Pointer, in device px with y up to match gl_FragCoord. Touch is ignored
       on purpose: a touch drag is a scroll gesture, and letting it move the
       loupe yanked the focus around while the visitor was only scrolling. */
    const mouse = { x: 0, y: 0 };
    const mouseTargetPos = { x: 0, y: 0 };
    let mouseSeen = false;
    let mouseOn = 0;
    let mouseTarget = 0;
    let viewportHeight = 1;
    let cssWidth = 1;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      mouseTargetPos.x = e.clientX * dpr;
      mouseTargetPos.y = (viewportHeight - e.clientY) * dpr;
      // First sighting: start the loupe where the pointer already is, so it
      // fades in on the spot instead of gliding over from the corner.
      if (!mouseSeen) {
        mouse.x = mouseTargetPos.x;
        mouse.y = mouseTargetPos.y;
        mouseSeen = true;
      }
      mouseTarget = 1;
    };
    const onPointerLeave = () => {
      mouseTarget = 0;
    };

    /* Section geometry, the viewport height the blend window is derived from,
       and the CSS-pixel width the mask half-width is expressed against.
       Measured only on navigation / resize / ResizeObserver / fonts.ready —
       never on the rAF or wheel hot path, where reading offsetTop forces a
       reflow. */
    const lastIndex = SECTION_IDS.length - 1;
    let sectionTops = SECTION_IDS.map(() => 0);
    let sectionBottoms = SECTION_IDS.map(() => 1);
    let hasSections = false;
    let blendWindow = 1;

    /* Keep-out ellipse per section: centre in viewport fractions (y measured
       from the bottom, matching gl_FragCoord), horizontal radius in CSS px,
       vertical radius as a fraction of height. Every section but the hero is a
       centred column and shares one shape; the hero's is measured off its
       actual headline, because its copy is a left-aligned block. */
    let maskCx = SECTION_IDS.map(() => 0.5);
    let maskCy = SECTION_IDS.map(() => 0.5);
    let maskHalfW = SECTION_IDS.map((_, i) => MASK_HALF_WIDTH_BY_INDEX[i] ?? 512);
    let maskHalfH = SECTION_IDS.map(() => MASK_HALF_HEIGHT_FRACTION);
    const maskFloor = SECTION_IDS.map((_, i) => MASK_FLOOR_BY_INDEX[i] ?? ROUTE_MASK_FLOOR);

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
       each CharacterReveal line stretches to the container's full width even
       though the name only draws about half of it. The per-character spans
       are the real extent — they're the leaf spans, the line wrappers being
       stretched flex items — plus the intro paragraph. */
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
         re-runs it too. Guarding these behind the size check once left the
         second program with its resolution uniforms at 0 and the whole
         background rendering nothing. */
      gl.viewport(0, 0, nextWidth, nextHeight);
      gl.uniform2f(uResolution, nextWidth, nextHeight);
      gl.uniform1f(uPixelRatio, dpr);

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

    /* The keep-out ellipse as a function of where the viewport centre sits
       relative to the section boundaries, eased across BLEND_FRACTION either
       side of each one. Position-driven, not event-driven, so it can never
       fall out of step with the scroll. Reused object, not one per frame. */
    const mask = { cx: 0.5, cy: 0.5, halfW: 512, halfH: MASK_HALF_HEIGHT_FRACTION, floor: ROUTE_MASK_FLOOR };
    const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

    const computeMask = (scrollY: number) => {
      // A route with none of the scrolling sections in it (/gallery,
      // /projects/[id]). Keyed off the measured DOM rather than the pathname
      // so the two can't disagree mid-navigation.
      if (!hasSections) {
        mask.cx = 0.5;
        mask.cy = 0.5;
        mask.halfW = staticMaskRef.current;
        mask.halfH = MASK_HALF_HEIGHT_FRACTION;
        mask.floor = ROUTE_MASK_FLOOR;
        return mask;
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
        a = index - 1;
        b = index;
        t = 0.5 + 0.5 * (fromStart / blendWindow);
      } else if (index < lastIndex && toEnd < blendWindow) {
        a = index;
        b = index + 1;
        t = 0.5 - 0.5 * (toEnd / blendWindow);
      }
      t = Math.min(1, Math.max(0, t));
      const eased = t * t * (3 - 2 * t);

      mask.cx = lerp(maskCx[a], maskCx[b], eased);
      mask.cy = lerp(maskCy[a], maskCy[b], eased);
      mask.halfW = lerp(maskHalfW[a], maskHalfW[b], eased);
      mask.halfH = lerp(maskHalfH[a], maskHalfH[b], eased);
      mask.floor = lerp(maskFloor[a], maskFloor[b], eased);
      return mask;
    };

    const applyScrollUniforms = (scrollY: number) => {
      const { cx, cy, halfW, halfH, floor } = computeMask(scrollY);
      gl.uniform1f(uMaskFloor, floor);
      gl.uniform2f(uMaskCenter, cx, cy);
      gl.uniform1f(uMaskHalfWidth, halfW / cssWidth);
      gl.uniform1f(uMaskHalfHeight, halfH);
      gl.uniform1f(uScroll, (scrollY / viewportHeight) * SCROLL_PARALLAX);
    };

    /* The single frame the reduced-motion path draws. It has to be re-issued
       after any re-measure, because setting canvas.width clears the drawing
       buffer and there is no loop to paint it again. */
    const renderStatic = () => {
      gl.uniform1f(uTime, 0);
      gl.uniform1f(uMouseOn, 0);
      gl.uniform2f(uMouse, 0, 0);
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

    const dispose = () => {
      remeasureRef.current = null;
      canvasRo.disconnect();
      bodyRo.disconnect();
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };

    if (reduceMotion) {
      // One static frame for wherever the page happens to be — no loop, no
      // listeners, no grain animation, no motion of any kind.
      renderStatic();
      return dispose;
    }

    let raf = 0;
    const start = performance.now();
    let last = start;
    const draw = (now: number) => {
      /* Exponential smoothing by elapsed time, so the loupe eases the same at
         60Hz and 144Hz, and a hitch can't make it jump (dt is clamped). */
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const follow = 1 - Math.exp(-dt / CURSOR_FOLLOW_SECONDS);
      const fade = 1 - Math.exp(-dt / CURSOR_FADE_SECONDS);
      mouse.x += (mouseTargetPos.x - mouse.x) * follow;
      mouse.y += (mouseTargetPos.y - mouse.y) * follow;
      mouseOn += (mouseTarget - mouseOn) * fade;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouseOn);
      applyScrollUniforms(window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(draw);
    };

    /* The pointer listener only exists while the loop runs — it does nothing
       but store two numbers, but there is no reason to keep it when nothing
       is drawing (tab hidden, or the canvas is display:none below md). */
    const startLoop = () => {
      if (raf) return;
      last = performance.now();
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
      raf = requestAnimationFrame(draw);
    };
    const stopLoop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };

    let isIntersecting = false;
    const sync = () => {
      if (isIntersecting && document.visibilityState === 'visible') startLoop();
      else stopLoop();
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
      stopLoop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      dispose();
    };
  }, []);

  /* -z-10, behind everything. The canvas paints the ground itself (opaque),
     so it must sit under all content — at z-0 it covered any text that wasn't
     itself positioned, which is most of a case-study page. That is also why
     no <main> carries bg-bg: the body paints the ground below md and when
     WebGL2 is missing, and a <main> background would hide the map. */
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden h-full w-full md:block"
    />
  );
}

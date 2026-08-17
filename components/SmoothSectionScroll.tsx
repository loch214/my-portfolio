'use client';

import { useEffect } from 'react';
import { SECTION_IDS } from '@/hooks/useActiveSection';

/* Native CSS scroll-snap gives no control over the snap animation — it lands fast
   and reads as a yank. On pointer devices we take the transition over: disable CSS
   snapping and ease between sections ourselves over ~1s.

   Touch devices keep native snapping (momentum scrolling handles it better than an
   intercepted swipe would), and reduced-motion users keep native behaviour entirely.

   Performance note: the wheel listener must be non-passive (it calls
   preventDefault to take the scroll over), which puts it on the critical path of
   every wheel event. So it may not touch layout-invalidating geometry —
   offsetTop / offsetHeight / scrollHeight all force a synchronous reflow, and
   reading seven of them per wheel event (trackpads fire 60–120/s) is what made
   scrolling feel laggy. Geometry is measured once up front and re-measured only
   when the document actually changes size. */

const DURATION = 950;
const COOLDOWN = 130;

/* Fired around the programmatic scroll so expensive always-on visuals (the hero's
   WebGL aura) can idle while the page is moving. */
export const SCROLL_START_EVENT = 'sectionscroll:start';
export const SCROLL_END_EVENT = 'sectionscroll:end';

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface SectionBox {
  top: number;
  bottom: number;
}

export default function SmoothSectionScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || isTouch) return;

    const root = document.documentElement;
    const previousSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = 'none';

    let animating = false;
    let rafId = 0;
    let cooldownUntil = 0;

    /* ── Cached geometry ───────────────────────────────────────────────────
       Read during measure() only, never from the wheel handler. */
    let boxes: SectionBox[] = [];
    let maxScrollY = 0;
    let viewportH = window.innerHeight;

    function measure() {
      viewportH = window.innerHeight;
      maxScrollY = root.scrollHeight - viewportH;
      boxes = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return { top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight };
      }).filter((box): box is SectionBox => box !== null);
    }

    measure();

    /* Re-measure when the document changes height — fonts finishing load, the
       Projects grid reflowing, an overlay opening. Cheap because it is driven by
       observers rather than polled from the scroll path. */
    let measureRaf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(measureRaf);
      measureRaf = requestAnimationFrame(measure);
    };

    window.addEventListener('resize', scheduleMeasure);
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(document.body);
    if (document.fonts?.ready) document.fonts.ready.then(scheduleMeasure).catch(() => {});

    function animateTo(targetY: number, duration = DURATION) {
      cancelAnimationFrame(rafId);
      const startY = window.scrollY;
      const delta = Math.min(targetY, maxScrollY) - startY;
      if (Math.abs(delta) < 2) return;

      const startedAt = performance.now();
      animating = true;
      window.dispatchEvent(new Event(SCROLL_START_EVENT));

      const step = (now: number) => {
        const t = Math.min(1, (now - startedAt) / duration);
        // 'instant' overrides the CSS `scroll-behavior: smooth`, which would
        // otherwise smooth every frame and fight this animation.
        window.scrollTo({ top: startY + delta * easeInOutCubic(t), behavior: 'instant' as ScrollBehavior });
        if (t < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          animating = false;
          cooldownUntil = performance.now() + COOLDOWN;
          window.dispatchEvent(new Event(SCROLL_END_EVENT));
        }
      };
      rafId = requestAnimationFrame(step);
    }

    function currentIndex(y: number) {
      let best = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < boxes.length; i++) {
        const distance = Math.abs(boxes[i].top - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }
      return best;
    }

    /* Scrolling inside a dialog or a deliberately native-scrolling region must not
       move the page between sections. */
    const isExempt = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest?.('[role="dialog"], [data-native-scroll]');

    function goToAdjacent(direction: 1 | -1) {
      if (!boxes.length) return false;

      const y = window.scrollY;
      const index = currentIndex(y);
      const current = boxes[index];

      // A section taller than the viewport (Projects) scrolls normally until its
      // far edge is reached — only then do we move on.
      if (direction > 0 && y + viewportH < current.bottom - 4) return false;
      if (direction < 0 && y > current.top + 4) return false;

      const next = boxes[index + direction];
      if (!next) return false;

      animateTo(next.top);
      return true;
    }

    function onWheel(event: WheelEvent) {
      if (isExempt(event.target)) return;
      if (animating || performance.now() < cooldownUntil) {
        event.preventDefault();
        return;
      }
      if (Math.abs(event.deltaY) < 4) return;
      if (goToAdjacent(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
    }

    function onAnchorClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const id = anchor.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      // A click is not on the wheel hot path, so measuring here is free.
      const targetTop = target.offsetTop;
      const sectionsAway = Math.abs(targetTop - window.scrollY) / Math.max(1, viewportH);
      animateTo(targetTop, Math.min(1500, DURATION + sectionsAway * 220));
      history.replaceState(null, '', `#${id}`);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(measureRaf);
      root.style.scrollSnapType = previousSnap;
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', scheduleMeasure);
      ro.disconnect();
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  return null;
}

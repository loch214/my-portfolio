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

export const DURATION = 950;
const COOLDOWN = 130;

/* Windows runs common display scales (125%, 150%) where offsetTop/offsetHeight
   round to whole device pixels but window.scrollY/innerHeight stay fractional.
   A 4px edge tolerance could lose that rounding error and never register "reached
   the bottom of this section" — the page would sit at the edge of the oversized
   Projects section and refuse to advance, reported as scrolling "getting stuck". */
const EDGE_TOLERANCE = 24;

/* Belt-and-suspenders against a dropped rAF (backgrounded tab, OS throttling)
   leaving `animating` stuck true forever, which would silently swallow every
   wheel event after it. If a scroll hasn't finished well past its own duration,
   force it to its resting state. */
const WATCHDOG_BUFFER = 600;

/* Sections taller than the viewport (Projects, and any section that grows past
   it on a short screen) used to scroll NATIVELY until their far edge, then hand
   over to the section animation. On a quick scroll the browser's own smooth
   wheel-scroll was still running when the next wheel event started our
   animation, and the two fought over scrollTop for a few frames — reported as
   the page "shaking like a small vibration". So the wheel is never handed to
   the browser any more: inside a tall section it drives a short eased glide
   that is clamped to the section's edges, and only one thing ever moves the
   page.

   INNER_GLIDE_SECONDS is the glide's time constant (exponential approach, so a
   burst of wheel events retargets smoothly instead of queueing). Sections that
   overflow by less than MIN_INNER_OVERFLOW px are treated as fitting: on a
   732px-tall laptop screen Education and Hobbies run ~30px over, and making the
   visitor scroll through 30px before the section change read as a hiccup. */
const INNER_GLIDE_SECONDS = 0.14;
const MIN_INNER_OVERFLOW = 80;

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

    /* Inner glide state — see INNER_GLIDE_SECONDS. */
    let gliding = false;
    let glideRaf = 0;
    let glideY = 0;
    let glideTarget = 0;
    let glideLast = 0;
    let watchdogId = 0;
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

    function finishAnimation() {
      cancelAnimationFrame(rafId);
      clearTimeout(watchdogId);
      animating = false;
      cooldownUntil = performance.now() + COOLDOWN;
      window.dispatchEvent(new Event(SCROLL_END_EVENT));
    }

    // Returns whether it actually moved the page — a caller that gets `false`
    // knows nothing is in flight and it is free to fall back to native scroll.
    function stopGlide() {
      cancelAnimationFrame(glideRaf);
      gliding = false;
    }

    function glideStep(now: number) {
      const dt = Math.min(0.05, (now - glideLast) / 1000);
      glideLast = now;
      glideY += (glideTarget - glideY) * (1 - Math.exp(-dt / INNER_GLIDE_SECONDS));
      if (Math.abs(glideTarget - glideY) < 0.5) glideY = glideTarget;
      window.scrollTo({ top: glideY, behavior: 'instant' as ScrollBehavior });
      if (glideY === glideTarget) {
        gliding = false;
      } else {
        glideRaf = requestAnimationFrame(glideStep);
      }
    }

    /* Move within a tall section, never past its edges. */
    function glideWithin(box: SectionBox, delta: number) {
      const min = box.top;
      const max = Math.min(box.bottom - viewportH, maxScrollY);
      if (!gliding) {
        glideY = window.scrollY;
        glideTarget = glideY;
      }
      glideTarget = Math.min(max, Math.max(min, glideTarget + delta));
      if (!gliding && glideTarget !== glideY) {
        gliding = true;
        glideLast = performance.now();
        glideRaf = requestAnimationFrame(glideStep);
      }
    }

    function animateTo(targetY: number, duration = DURATION) {
      stopGlide();
      cancelAnimationFrame(rafId);
      clearTimeout(watchdogId);
      const startY = window.scrollY;
      const delta = Math.min(targetY, maxScrollY) - startY;
      if (Math.abs(delta) < 2) {
        // Already at (or basically at) the target — jump the remainder instantly
        // rather than reporting "nothing to do", so a wheel tick this small still
        // resolves to a settled position instead of leaving the page mid-drift.
        window.scrollTo({ top: startY + delta, behavior: 'instant' as ScrollBehavior });
        return true;
      }

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
          finishAnimation();
        }
      };
      rafId = requestAnimationFrame(step);

      // A tab that gets backgrounded mid-scroll has its rAF throttled or paused
      // entirely, so `step` may never reach t >= 1. Force a resolution instead of
      // leaving `animating` — and every wheel event after it — stuck forever.
      watchdogId = window.setTimeout(() => {
        if (!animating) return;
        window.scrollTo({ top: startY + delta, behavior: 'instant' as ScrollBehavior });
        finishAnimation();
      }, duration + WATCHDOG_BUFFER);

      return true;
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

    /* Wheel deltas arrive in pixels, lines or pages depending on device and
       OS settings; the glide wants pixels. */
    const wheelPixels = (event: WheelEvent) =>
      event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * viewportH : event.deltaY;

    /* Always claims the wheel event (returns true) when there is anywhere to
       go; the browser never scrolls the page itself. */
    function handleWheel(direction: 1 | -1, delta: number, allowSectionChange = true) {
      if (!boxes.length) return false;

      // Same guard as WATCHDOG_BUFFER, for the glide: if rAF has stalled
      // (backgrounded tab, OS throttling), land it now rather than leaving
      // `gliding` true and every section change held behind it.
      if (gliding && performance.now() - glideLast > 250) {
        window.scrollTo({ top: glideTarget, behavior: 'instant' as ScrollBehavior });
        stopGlide();
      }

      const y = gliding ? glideTarget : window.scrollY;
      const index = currentIndex(y);
      const current = boxes[index];
      const innerMax = Math.min(current.bottom - viewportH, maxScrollY);
      const isTall = innerMax - current.top > MIN_INNER_OVERFLOW;

      if (isTall) {
        // Not at the edge we're heading for yet: glide within the section. The
        // tolerance absorbs subpixel/DPI rounding drift (offsetTop/offsetHeight
        // round to device pixels; scrollY can be fractional under non-100%
        // display scaling), so the edge is never a few pixels out of reach.
        const atEdge = direction > 0 ? y >= innerMax - EDGE_TOLERANCE : y <= current.top + EDGE_TOLERANCE;
        if (!atEdge) {
          glideWithin(current, delta);
          return true;
        }
        // At the edge but the glide is still settling onto it: hold rather than
        // starting the section animation on top of a moving page.
        if (gliding) return true;
      }

      // A tiny delta never changes section — it can only nudge a glide.
      if (!allowSectionChange) return true;

      if (!isTall && direction < 0 && y > current.top + EDGE_TOLERANCE) {
        // Left mid-section (scrollbar drag, keyboard): settle back to its top.
        return animateTo(current.top);
      }

      const next = boxes[index + direction];
      if (!next) {
        // Past the last section boundary: let the tail of the page glide too.
        glideWithin({ top: current.top, bottom: Math.max(current.bottom, maxScrollY + viewportH) }, delta);
        return true;
      }

      return animateTo(next.top);
    }

    function onWheel(event: WheelEvent) {
      if (isExempt(event.target)) return;
      if (animating || performance.now() < cooldownUntil) {
        event.preventDefault();
        return;
      }
      if (event.deltaY === 0) return;
      // Tiny deltas (slow trackpad movement, the tail of an inertia curve) are
      // still claimed, so the browser can't start a native scroll under us, but
      // they only ever move the page as a glide inside a tall section — never a
      // section change.
      const small = Math.abs(event.deltaY) < 4;
      if (handleWheel(event.deltaY > 0 ? 1 : -1, wheelPixels(event), !small)) event.preventDefault();
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
      if (!target) {
        // The section doesn't exist on this page (a case study, /gallery) — a bare
        // "#id" href would otherwise just tack the hash onto the current URL,
        // stranding the visitor here and leaving a bogus history entry that makes
        // the back button useless. Send them to the actual section on the home page.
        if (window.location.pathname !== '/') {
          event.preventDefault();
          window.location.assign(`/#${id}`);
        }
        return;
      }

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
      stopGlide();
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(measureRaf);
      clearTimeout(watchdogId);
      root.style.scrollSnapType = previousSnap;
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', scheduleMeasure);
      ro.disconnect();
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  return null;
}

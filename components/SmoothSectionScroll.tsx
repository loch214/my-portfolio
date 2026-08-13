'use client';

import { useEffect } from 'react';
import { SECTION_IDS } from '@/hooks/useActiveSection';

/* Native CSS scroll-snap gives no control over the snap animation — it lands fast
   and reads as a yank. On pointer devices we take the transition over: disable CSS
   snapping and ease between sections ourselves over ~1s.

   Touch devices keep native snapping (momentum scrolling handles it better than an
   intercepted swipe would), and reduced-motion users keep native behaviour entirely. */

const DURATION = 950;
const COOLDOWN = 130;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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

    const getSections = () =>
      SECTION_IDS
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

    const maxScroll = () => root.scrollHeight - window.innerHeight;

    function animateTo(targetY: number, duration = DURATION) {
      cancelAnimationFrame(rafId);
      const startY = window.scrollY;
      const delta = Math.min(targetY, maxScroll()) - startY;
      if (Math.abs(delta) < 2) return;

      const startedAt = performance.now();
      animating = true;

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
        }
      };
      rafId = requestAnimationFrame(step);
    }

    function currentIndex(list: HTMLElement[]) {
      const y = window.scrollY;
      let best = 0;
      let bestDistance = Infinity;
      list.forEach((section, i) => {
        const distance = Math.abs(section.offsetTop - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      return best;
    }

    /* Scrolling inside a dialog or a deliberately native-scrolling region must not
       move the page between sections. */
    const isExempt = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest?.('[role="dialog"], [data-native-scroll]');

    function goToAdjacent(direction: 1 | -1) {
      const list = getSections();
      if (!list.length) return false;

      const viewportH = window.innerHeight;
      const y = window.scrollY;
      const index = currentIndex(list);
      const current = list[index];
      const top = current.offsetTop;
      const bottom = top + current.offsetHeight;

      // A section taller than the viewport (Projects) scrolls normally until its
      // far edge is reached — only then do we move on.
      if (direction > 0 && y + viewportH < bottom - 4) return false;
      if (direction < 0 && y > top + 4) return false;

      const next = list[index + direction];
      if (!next) return false;

      animateTo(next.offsetTop);
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
      const sectionsAway = Math.abs(target.offsetTop - window.scrollY) / Math.max(1, window.innerHeight);
      animateTo(target.offsetTop, Math.min(1500, DURATION + sectionsAway * 220));
      history.replaceState(null, '', `#${id}`);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('click', onAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      root.style.scrollSnapType = previousSnap;
      window.removeEventListener('wheel', onWheel);
      document.removeEventListener('click', onAnchorClick);
    };
  }, []);

  return null;
}

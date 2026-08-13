'use client';

import { useEffect } from 'react';

/* Freeze page scrolling while an overlay is open, so wheel/touch inside a dialog
   never chains through to the page behind it. Compensates for the removed
   scrollbar so the layout doesn't shift sideways when the lock engages. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    root.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [active]);
}

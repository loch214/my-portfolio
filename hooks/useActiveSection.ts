'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const SECTION_IDS = ['home', 'about', 'education', 'sports', 'hobbies', 'projects', 'connect'];

export function useActiveSection() {
  const [active, setActive] = useState('home');
  const pathname = usePathname();

  /* Re-observes on navigation. The consumers of this hook (SectionNav, the nav
     drawer) live in the root layout and stay mounted across route changes, so
     with an empty dep list the observer stayed attached to the section nodes
     from the *previous* render of `/` — which a client-side round trip through
     a case study replaces. It then never fired again and the active section
     froze wherever it was. */
  useEffect(() => {
    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return active;
}

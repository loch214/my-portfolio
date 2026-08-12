'use client';

import { useEffect, useState } from 'react';

export const SECTION_IDS = ['home', 'about', 'education', 'sports', 'hobbies', 'projects', 'connect'];

export function useActiveSection() {
  const [active, setActive] = useState('home');

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
  }, []);

  return active;
}

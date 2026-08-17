'use client';

import { useActiveSection, SECTION_IDS } from '@/hooks/useActiveSection';

const sections = [
  { id: SECTION_IDS[0], label: 'Home' },
  { id: SECTION_IDS[1], label: 'About' },
  { id: SECTION_IDS[2], label: 'Education' },
  { id: SECTION_IDS[3], label: 'Sports' },
  { id: SECTION_IDS[4], label: 'Hobbies' },
  { id: SECTION_IDS[5], label: 'Projects' },
  { id: SECTION_IDS[6], label: 'Contact' },
];

export default function SectionNav() {
  const active = useActiveSection();

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3.5 lg:flex"
    >
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={`Go to ${section.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-2.5 rounded-full"
          >
            <span
              className={`t-data rounded-sm border border-line bg-bg px-2.5 py-1 text-neutral-300 transition-opacity ${
                isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all ${
                isActive
                  ? 'h-2.5 w-7 bg-accent'
                  : 'h-2.5 w-2.5 bg-neutral-400 group-hover:bg-accent-400'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

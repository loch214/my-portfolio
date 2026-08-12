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
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {sections.map((section) => {
        const isActive = active === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={`Go to ${section.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[11px] tracking-wide transition-opacity ${
                isActive ? 'text-accent opacity-100' : 'text-muted opacity-0 group-hover:opacity-100'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`h-2 w-2 rounded-full border transition-all ${
                isActive
                  ? 'border-accent bg-accent scale-125'
                  : 'border-line bg-transparent group-hover:border-accent'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

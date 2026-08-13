/* Section illustrations — flat 2D vector scenes built from Organic tokens.
   Soft circular and blob shapes per the system's direction; no hard-coded colors. */

interface IllustrationProps {
  className?: string;
}

const BLOB =
  'M160 16c64 0 144 40 144 120 0 84-64 168-144 168S16 220 16 136 96 16 160 16z';

/* Hero — a developer at the desk, framed in a soft circle. */
export function HeroScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 440 440" className={className} role="img" aria-label="An illustrated developer working at a laptop">
      <defs>
        <clipPath id="hero-clip">
          <circle cx="220" cy="220" r="190" />
        </clipPath>
      </defs>
      <circle cx="220" cy="220" r="190" fill="var(--color-accent-100)" />
      <g clipPath="url(#hero-clip)">
        {/* ambient shapes */}
        <circle cx="326" cy="116" r="46" fill="var(--color-accent-200)" />
        <circle cx="96" cy="226" r="9" fill="var(--color-accent-2-500)" />
        <g
          fill="none"
          stroke="var(--color-accent-400)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M116 136l-18 18 18 18" />
          <path d="M342 194l18 18-18 18" />
        </g>

        {/* floor */}
        <rect x="-20" y="334" width="480" height="130" fill="var(--color-accent-200)" />

        {/* figure */}
        <rect x="208" y="200" width="24" height="34" rx="11" fill="var(--color-accent-300)" />
        <circle cx="220" cy="172" r="41" fill="var(--color-accent-300)" />
        <path
          d="M181 170a39 39 0 0 1 78 0c-9-12-23-19-39-19s-30 7-39 19z"
          fill="var(--color-accent-900)"
        />
        <path d="M140 320c0-56 36-92 80-92s80 36 80 92z" fill="var(--color-accent-2-600)" />

        {/* laptop */}
        <rect x="162" y="252" width="116" height="58" rx="7" fill="var(--color-neutral-900)" />
        <rect x="169" y="259" width="102" height="44" rx="3" fill="var(--color-accent-200)" />
        <g stroke="var(--color-accent-600)" strokeWidth="5" strokeLinecap="round">
          <path d="M179 271h30" />
          <path d="M179 281h52" />
          <path d="M179 291h22" />
        </g>

        {/* desk */}
        <rect x="52" y="318" width="336" height="17" rx="8.5" fill="var(--color-accent-700)" />
        <rect x="150" y="306" width="140" height="13" rx="6.5" fill="var(--color-neutral-800)" />

        {/* mug */}
        <rect x="78" y="288" width="36" height="30" rx="9" fill="var(--color-accent-500)" />
        <path
          d="M114 296h8a10 10 0 0 1 0 20h-8"
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="7"
        />

        {/* plant */}
        <path d="M312 318h46l-7-36h-32z" fill="var(--color-accent-600)" />
        <path d="M335 282c0-28 12-44 31-51-4 25-13 39-31 51z" fill="var(--color-accent-2-600)" />
        <path d="M335 282c0-26-11-42-29-48 4 23 11 36 29 48z" fill="var(--color-accent-2-700)" />
      </g>
      <circle
        cx="220"
        cy="220"
        r="190"
        fill="none"
        stroke="var(--color-accent-300)"
        strokeWidth="3"
      />
    </svg>
  );
}

/* About — a desk: laptop, mug, plant. */
export function AboutScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="An illustrated desk with a laptop, mug and plant">
      <path d={BLOB} fill="var(--color-accent-2-200)" />
      <rect x="60" y="120" width="130" height="86" rx="12" fill="var(--color-neutral-800)" />
      <rect x="70" y="130" width="110" height="66" rx="7" fill="var(--color-accent-200)" />
      <g stroke="var(--color-accent-600)" strokeWidth="5" strokeLinecap="round">
        <path d="M84 150h58" />
        <path d="M84 165h82" />
        <path d="M84 180h44" />
      </g>
      <path d="M46 206h158a10 10 0 0 1-10 12H56a10 10 0 0 1-10-12z" fill="var(--color-neutral-900)" />
      <rect x="214" y="158" width="46" height="48" rx="12" fill="var(--color-accent-500)" />
      <path
        d="M260 170h10a14 14 0 0 1 0 28h-10"
        fill="none"
        stroke="var(--color-accent-500)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M222 206h30l-4 14a6 6 0 0 1-6 5h-10a6 6 0 0 1-6-5z" fill="var(--color-accent-700)" />
      <path d="M228 92h34l-6 62h-22z" fill="var(--color-accent-600)" />
      <path
        d="M245 92c0-22 10-36 28-42-6 20-12 32-28 42z"
        fill="var(--color-accent-2-600)"
      />
      <path
        d="M245 92c0-20-9-33-25-39 5 18 11 29 25 39z"
        fill="var(--color-accent-2-700)"
      />
      <circle cx="86" cy="86" r="13" fill="var(--color-accent-400)" />
      <circle cx="122" cy="70" r="7" fill="var(--color-accent-2-600)" />
    </svg>
  );
}

/* Education — stacked books with a graduation cap. */
export function EducationScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="An illustrated stack of books with a graduation cap">
      <path d={BLOB} fill="var(--color-accent-200)" />
      <rect x="66" y="222" width="188" height="34" rx="14" fill="var(--color-accent-600)" />
      <rect x="80" y="234" width="26" height="10" rx="5" fill="var(--color-accent-200)" />
      <rect x="78" y="186" width="164" height="34" rx="14" fill="var(--color-accent-2-600)" />
      <rect x="92" y="198" width="26" height="10" rx="5" fill="var(--color-accent-2-200)" />
      <rect x="90" y="150" width="140" height="34" rx="14" fill="var(--color-accent-500)" />
      <rect x="104" y="162" width="26" height="10" rx="5" fill="var(--color-accent-100)" />
      <path d="M160 74l78 36-78 34-78-34z" fill="var(--color-neutral-800)" />
      <path
        d="M118 126v26c0 12 19 20 42 20s42-8 42-20v-26l-42 18z"
        fill="var(--color-neutral-900)"
      />
      <path
        d="M238 110v40"
        stroke="var(--color-accent-500)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="238" cy="156" r="10" fill="var(--color-accent-500)" />
      <circle cx="70" cy="106" r="9" fill="var(--color-accent-2-500)" />
      <circle cx="252" cy="212" r="7" fill="var(--color-accent-400)" />
    </svg>
  );
}

/* Sports — a swimmer in water, with a cricket ball. */
export function SportsScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="An illustrated swimmer in water beside a cricket ball">
      <path d={BLOB} fill="var(--color-accent-2-200)" />
      <circle cx="126" cy="122" r="24" fill="var(--color-accent-700)" />
      <path
        d="M104 158c26-14 54-14 82 4"
        stroke="var(--color-accent-700)"
        strokeWidth="17"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M150 128c18-20 38-26 58-18"
        stroke="var(--color-accent-500)"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      <g
        stroke="var(--color-accent-2-600)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M56 196c22-16 44 16 66 0s44-16 66 0 44 16 66 0" />
        <path d="M56 232c22-16 44 16 66 0s44-16 66 0 44 16 66 0" />
      </g>
      <path
        d="M56 264c22-16 44 16 66 0s44-16 66 0 44 16 66 0"
        stroke="var(--color-accent-2-700)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="252" cy="94" r="27" fill="var(--color-accent-700)" />
      <path
        d="M252 67a27 27 0 0 1 0 54"
        fill="none"
        stroke="var(--color-accent-200)"
        strokeWidth="4"
        strokeDasharray="7 7"
      />
      <circle cx="74" cy="96" r="10" fill="var(--color-accent-400)" />
    </svg>
  );
}

/* Hobbies — tinkering and art: an idea bulb beside a paint palette. */
export function HobbiesScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="An illustrated lightbulb and paint palette">
      <path d={BLOB} fill="var(--color-accent-200)" />

      {/* idea rays */}
      <g
        fill="none"
        stroke="var(--color-accent-400)"
        strokeWidth="6"
        strokeLinecap="round"
      >
        <path d="M190 78V62" />
        <path d="M244 116l14-9" />
        <path d="M136 116l-14-9" />
      </g>

      {/* bulb */}
      <circle cx="190" cy="146" r="47" fill="var(--color-accent-500)" />
      <circle cx="190" cy="146" r="32" fill="var(--color-accent-300)" />
      <path
        d="M177 152c5-13 8-13 13 0 5 13 8 13 13 0"
        fill="none"
        stroke="var(--color-accent-800)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="171" y="188" width="38" height="15" rx="7.5" fill="var(--color-accent-800)" />
      <rect x="176" y="205" width="28" height="13" rx="6.5" fill="var(--color-accent-900)" />

      {/* sparks of curiosity */}
      <circle cx="262" cy="86" r="10" fill="var(--color-accent-400)" />
      <circle cx="288" cy="132" r="6" fill="var(--color-accent-2-500)" />
      <circle cx="240" cy="56" r="5" fill="var(--color-accent-2-600)" />

      {/* palette */}
      <path
        d="M74 246a38 38 0 1 1 38-38c0 10-14 6-14 18 0 10 12 6 12 16 0 6-16 10-36 4z"
        fill="var(--color-accent-2-600)"
      />
      <circle cx="60" cy="192" r="7" fill="var(--color-accent-400)" />
      <circle cx="84" cy="182" r="7" fill="var(--color-accent-100)" />
      <circle cx="52" cy="218" r="7" fill="var(--color-accent-2-200)" />
    </svg>
  );
}

/* Projects — stacked interface windows. */
export function ProjectsScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="Illustrated stacked application windows">
      <path d={BLOB} fill="var(--color-accent-2-200)" />
      <rect x="52" y="76" width="156" height="112" rx="18" fill="var(--color-accent-2-600)" />
      <rect x="52" y="76" width="156" height="26" rx="13" fill="var(--color-accent-2-700)" />
      <g fill="var(--color-accent-2-200)">
        <circle cx="70" cy="89" r="5" />
        <circle cx="86" cy="89" r="5" />
        <circle cx="102" cy="89" r="5" />
      </g>
      <g stroke="var(--color-accent-2-200)" strokeWidth="6" strokeLinecap="round">
        <path d="M70 124h74" />
        <path d="M70 142h108" />
        <path d="M70 160h52" />
      </g>
      <rect x="120" y="140" width="152" height="112" rx="18" fill="var(--color-accent-600)" />
      <rect x="120" y="140" width="152" height="26" rx="13" fill="var(--color-accent-700)" />
      <g fill="var(--color-accent-200)">
        <circle cx="138" cy="153" r="5" />
        <circle cx="154" cy="153" r="5" />
        <circle cx="170" cy="153" r="5" />
      </g>
      <g stroke="var(--color-accent-200)" strokeWidth="6" strokeLinecap="round">
        <path d="M138 188h70" />
        <path d="M138 206h104" />
        <path d="M138 224h48" />
      </g>
      <circle cx="252" cy="92" r="12" fill="var(--color-accent-400)" />
    </svg>
  );
}

/* Contact — an envelope and a paper plane. */
export function ContactScene({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 320" className={className} role="img" aria-label="An illustrated envelope and paper plane">
      <path d={BLOB} fill="var(--color-accent-200)" />
      <rect x="54" y="132" width="164" height="116" rx="18" fill="var(--color-accent-600)" />
      <path
        d="M54 152l68 50a18 18 0 0 0 22 0l68-50"
        fill="none"
        stroke="var(--color-accent-200)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M248 54l30 92-56-24-38 28 8-52z" fill="var(--color-accent-2-600)" />
      <path d="M248 54l-56 44 30 24z" fill="var(--color-accent-2-700)" />
      <g
        fill="none"
        stroke="var(--color-accent-400)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 18"
      >
        <path d="M88 112c36-32 80-40 124-30" />
      </g>
      <circle cx="256" cy="204" r="10" fill="var(--color-accent-2-500)" />
      <circle cx="70" cy="96" r="8" fill="var(--color-accent-400)" />
    </svg>
  );
}

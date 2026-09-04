import { SECTION_IDS } from '@/hooks/useActiveSection';

/* Field N in fields.ts is SECTION_IDS[N] — home, about, education, sports,
   hobbies, projects, connect, in that order. AsciiField works in index space
   (it derives the index from scroll position, not from a section id), so the
   per-field lookups it uses are the *_BY_INDEX arrays at the bottom. */

/* 0 = render this section's field as smooth smoke, 1 = quantize it to glyphs.
   Only the hero is smoke; every other section is live ASCII. The value is
   interpolated across a section change, which is what makes the hero dissolve
   into type on the first scroll. */
export const SECTION_GLYPH_MIX: Record<string, number> = {
  home: 0,
  about: 1,
  education: 1,
  sports: 1,
  hobbies: 1,
  projects: 1,
  connect: 1,
};

/* Half the text column's max-width in px, per section — home/projects use
   max-w-6xl (72rem), everything else uses max-w-5xl (64rem). Stock Tailwind
   scale, unmodified in tailwind.config.ts, so these are safe to hardcode
   rather than measure from the DOM on every resize. */
export const SECTION_MASK_HALF_WIDTH_PX: Record<string, number> = {
  home: 576,
  about: 512,
  education: 512,
  sports: 512,
  hobbies: 512,
  projects: 576,
  connect: 512,
};

export const FIELD_COUNT = SECTION_IDS.length;

/* Same data as the records above, indexed by field index instead of id — lets
   the shader-uniform code do a plain array lookup by uFieldA/uFieldB. */
export const MASK_HALF_WIDTH_BY_INDEX = SECTION_IDS.map((id) => SECTION_MASK_HALF_WIDTH_PX[id]);
export const GLYPH_MIX_BY_INDEX = SECTION_IDS.map((id) => SECTION_GLYPH_MIX[id]);

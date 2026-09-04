import { SECTION_IDS } from '@/hooks/useActiveSection';

/* Field N in fields.ts is SECTION_IDS[N] — home, about, education, sports,
   hobbies, projects, connect, in that order. AsciiField works in index space
   (it derives the index from scroll position, not from a section id), so the
   per-field lookups it uses are the *_BY_INDEX arrays at the bottom. */

/* 1 = this section's glyphs warm toward the brass accent around the pointer
   and gain a little density with it (see the halo in shaders.ts MAIN, and
   field0 in fields.ts). Hero only: it is what makes the first viewport the
   most alive background on the site while still being drawn in the same
   characters as every other section. Interpolated across a section change, so
   the warmth fades out rather than switching off. */
export const SECTION_CURSOR_WARMTH: Record<string, number> = {
  home: 1,
  about: 0,
  education: 0,
  sports: 0,
  hobbies: 0,
  projects: 0,
  connect: 0,
};

/* Vertical radius of the text keep-out, as a fraction of viewport height.
   One value for every section whose copy is a centred column; the hero
   overrides it, along with the other three mask parameters, from a real
   measurement of its headline (see AsciiField.tsx). */
export const MASK_HALF_HEIGHT_FRACTION = 0.42;

/* Padding added around the hero's measured headline box before it becomes the
   keep-out ellipse, in px. Generous vertically because the traits line and the
   intro paragraph sit directly underneath it. */
export const HERO_MASK_PADDING_X = 70;
export const HERO_MASK_PADDING_Y = 50;

/* Half the text column's max-width in px, per section — home/projects use
   max-w-6xl (72rem), everything else uses max-w-5xl (64rem). Stock Tailwind
   scale, unmodified in tailwind.config.ts, so these are safe to hardcode
   rather than measure from the DOM on every resize. The home entry is only a
   fallback now: the hero's real mask is measured. */
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
/* Output level per field: lum -> lum * gain + bias, applied in shaders.ts.
   Tuned against measured ink coverage in the browser rather than by eye —
   the target is a mean alpha of 9 over an unmasked sample, which lands every
   section at 8-10% of cells carrying a glyph.

   Bisecting on *coverage* instead was a mistake worth not repeating: an inky
   ramp reaches a coverage target with far fewer cells, so its gain collapsed
   (about bottomed out at 0.15) and the field never climbed past the first step
   of its own ramp. Mean alpha is the honest measure of how heavy a field looks,
   and it lets each section use its whole ramp at matched weight. */
export const FIELD_LEVELS: Array<{ gain: number; bias: number }> = [
  { gain: 0.85, bias: 0.04 }, // home
  { gain: 0.78, bias: 0.04 }, // about
  { gain: 1.13, bias: 0.04 }, // education
  { gain: 0.96, bias: 0.04 }, // sports
  { gain: 0.88, bias: 0.04 }, // hobbies
  { gain: 0.39, bias: 0.04 }, // projects
  { gain: 0.53, bias: 0.04 }, // connect
];

export const MASK_HALF_WIDTH_BY_INDEX = SECTION_IDS.map((id) => SECTION_MASK_HALF_WIDTH_PX[id]);
export const WARMTH_BY_INDEX = SECTION_IDS.map((id) => SECTION_CURSOR_WARMTH[id]);
export const HERO_INDEX = SECTION_IDS.indexOf('home');

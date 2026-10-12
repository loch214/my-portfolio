import { SECTION_IDS } from '@/hooks/useActiveSection';

/* Tuning for the contour background (ContourField.tsx + shader.ts). Every
   number here was set by looking at the result in the browser, against the
   owner's two standing complaints about backgrounds: "doesn't look good" and
   "the cursor effect is too subtle to notice". */

/* How many contour bands span one unit of terrain height. Higher packs the
   lines tighter; much past 18 the map reads as a fingerprint. */
export const CONTOUR_LEVELS = 16;

/* Terrain zoom: noise units per viewport height. 2.2 with the 0.38 domain
   scale in the shader gives broad hills, two or three per screen. The first
   prototype used a 5-octave fbm at this scale and the result read as noisy
   blobs, not a map — the shader deliberately uses 3 octaves. */
export const TERRAIN_SCALE = 2.2;

/* How fast the map travels relative to the page. 1.0 would pin the map to
   the content like a printed backdrop; below 1 it sits slightly deeper than
   the copy, which reads as depth without ever drifting out of sync with the
   scroll (it is a pure function of scrollY). */
export const SCROLL_PARALLAX = 0.7;

/* Cursor loupe radius, as a fraction of viewport height. The lines inside it
   turn brass, thicken, and the map swells outward. The first build of this
   was ~0.22 and the owner said people wouldn't notice it. */
export const CURSOR_RADIUS = 0.3;

/* How quickly the loupe follows the pointer and fades in/out, as time
   constants in seconds (exponential smoothing, frame-rate independent). The
   first version tracked the pointer raw and faded in over ~0.25s; the owner
   found it "too aggressive — suddenly applying and removing the effect". */
export const CURSOR_FOLLOW_SECONDS = 0.35;
export const CURSOR_FADE_SECONDS = 0.9;

/* Film grain amplitude (± on a 0-1 channel) and cell size in CSS px. Animated
   at 24fps in the shader so it reads as film, not static noise. */
export const GRAIN_STRENGTH = 0.075;
export const GRAIN_CELL_CSS_PX = 1;

/* Vertical radius of the text keep-out, as a fraction of viewport height.
   One value for every section whose copy is a centred column; the hero
   overrides it, along with the other three mask parameters, from a real
   measurement of its headline (see ContourField.tsx). */
export const MASK_HALF_HEIGHT_FRACTION = 0.42;

/* How much of the map survives inside the keep-out (0 = none), per section.
   Sections whose copy sits straight on the ground (hero, about, connect) stay
   near zero. The carded sections put their copy on .card-glass panels, which
   are slightly translucent; 0.7 lets the lines show faintly through them, as
   the owner asked, while the panel fill keeps text on near-solid ground. */
export const SECTION_MASK_FLOOR: Record<string, number> = {
  home: 0.06,
  about: 0.06,
  education: 0.7,
  sports: 0.7,
  hobbies: 0.7,
  projects: 0.7,
  connect: 0.06,
};
export const ROUTE_MASK_FLOOR = 0.06;

/* Padding added around the hero's measured headline box before it becomes the
   keep-out ellipse, in px. Generous vertically because the traits line and the
   intro paragraph sit directly underneath it. */
export const HERO_MASK_PADDING_X = 70;
export const HERO_MASK_PADDING_Y = 50;

/* Half the text column's max-width in px, per section — home/projects use
   max-w-6xl (72rem), everything else uses max-w-5xl (64rem). Stock Tailwind
   scale, unmodified in tailwind.config.ts, so these are safe to hardcode
   rather than measure from the DOM on every resize. The home entry is only a
   fallback: the hero's real mask is measured. */
export const SECTION_MASK_HALF_WIDTH_PX: Record<string, number> = {
  home: 576,
  about: 512,
  education: 512,
  sports: 512,
  hobbies: 512,
  projects: 576,
  connect: 512,
};

export const MASK_HALF_WIDTH_BY_INDEX = SECTION_IDS.map((id) => SECTION_MASK_HALF_WIDTH_PX[id]);
export const MASK_FLOOR_BY_INDEX = SECTION_IDS.map((id) => SECTION_MASK_FLOOR[id]);
export const HERO_INDEX = SECTION_IDS.indexOf('home');

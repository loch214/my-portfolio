/* Seven fields, one per section (SECTION_IDS order).

   Field 0 (home) is the odd one out: the hero keeps the smooth brass smoke it
   always had, so field0 exists only as the glyph-shaped version of that same
   noise, used for the few hundred milliseconds the hero cross-fades into
   About. Sections 1-6 are the live ASCII fields — every one of them is a
   full-viewport procedural pattern, not an image.

   An earlier version sampled hand-drawn icon tiles (a bust, a book, a swimmer)
   into a small box in the right margin. It read as an unidentifiable smudge of
   dots sitting on top of the content and was cut entirely; there is no scene
   atlas any more.

   Shared signature, so shaders.ts can dispatch uniformly:

     float fieldN(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV)

   p       — aspect-corrected cell UV (x scaled by uAspect), snapped to the grid.
             Use this for anything that must stay circular/isotropic on screen.
   t       — seconds since mount, raw. Each field picks its own speed; keep them
             slow. Fast motion in a coarse glyph grid reads as flicker, because
             cells pop between ramp steps rather than sliding.
   mouseOffset — (uMouse - 0.5) * 0.18, zero on every section but home.
   extra   — spare per-field driver; only `projects` uses it (scroll depth 0-1).
   rawUV   — un-aspect-corrected cell UV (0..1 both axes). Use this for anything
             that should stay pinned to the viewport edges, like rules or lanes.

   Return roughly 0..1. The text-column keep-out mask is applied centrally in
   shaders.ts, so no field needs to handle it.

   Relies on hash/noise/fbm from the shared preamble in shaders.ts. */

/* Home — the hero's original fbm/domain-warp drift. Rendered smooth (not
   quantized) by the smoke branch in shaders.ts; this glyph version only
   surfaces mid-transition. */
export const FIELD_HOME = `
float field0(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.045;
  vec2 warp = p * 1.6 + mouseOffset;
  warp.x += fbm(p * 2.2 + ts) * 0.7;
  warp.y += fbm(p * 2.2 - ts) * 0.7;
  return smoothstep(0.22, 0.88, fbm(warp + ts * 0.5));
}`;

/* About — slow topographic contours. Noise sliced into bands, so the pattern
   is line work rather than a cloud, and the whole field creeps rather than
   boils. */
export const FIELD_ABOUT = `
float field1(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.035;
  vec2 q = p * 1.75;
  q.x += fbm(q * 0.7 + ts) * 0.45;
  float n = fbm(q + vec2(0.0, ts * 0.8));
  float bands = abs(fract(n * 6.5) - 0.5) * 2.0;
  return smoothstep(0.85, 0.05, bands);
}`;

/* Education — ruled paper: horizontal rules with a margin rule down the left,
   and one soft band of light travelling down the page. */
export const FIELD_EDUCATION = `
float field2(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float rule = 1.0 - smoothstep(0.0, 0.34, abs(fract(rawUV.y * 15.0) - 0.5) * 2.0);
  // Margin rules on both sides. One-sided (a real notebook margin) read as an
  // accident rather than as a frame once the keep-out clears the middle.
  float margin = 1.0 - smoothstep(0.0, 0.03, abs(abs(rawUV.x - 0.5) - 0.415));
  float band = fract(t * 0.045);
  float sweep = exp(-pow((rawUV.y - band) * 4.5, 2.0));
  return clamp(max(rule * (0.32 + 0.8 * sweep), margin * 0.6), 0.0, 1.0);
}`;

/* Sports — lanes of water: horizontal lines that undulate, with light
   travelling along them. */
export const FIELD_SPORTS = `
float field3(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float y = rawUV.y * 8.0 + sin(rawUV.x * 6.5 - t * 0.55) * 0.3;
  float lane = 1.0 - smoothstep(0.0, 0.42, abs(fract(y) - 0.5) * 2.0);
  float travel = 0.5 + 0.5 * sin(rawUV.x * 4.5 - t * 0.9 + floor(y) * 1.3);
  return clamp(lane * (0.25 + 0.85 * travel), 0.0, 1.0);
}`;

/* Hobbies — pencil crosshatch. Two diagonal rulings, slowly counter-rotating
   in phase, gated by a drifting noise wash so the shading breathes instead of
   sitting there as wallpaper. */
export const FIELD_HOBBIES = `
float field4(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float a = sin((p.x + p.y) * 38.0 + sin(t * 0.16) * 1.4);
  float b = sin((p.x - p.y) * 38.0 - sin(t * 0.12) * 1.4);
  float hatch = max(smoothstep(0.35, 1.0, a), smoothstep(0.35, 1.0, b) * 0.75);
  float wash = fbm(p * 1.3 + t * 0.02);
  return clamp(hatch * smoothstep(0.28, 0.72, wash), 0.0, 1.0);
}`;

/* Projects — a wireframe that assembles as you scroll. Each box has its own
   position in the build order (hashed from its cell), and `extra` is scroll
   depth through the section, so the field is drawn by the reader rather than
   by a clock. Keeps a floor so the section is never blank on arrival. */
export const FIELD_PROJECTS = `
float field5(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  vec2 g = rawUV * vec2(14.0, 9.0);
  vec2 cell = floor(g);
  vec2 f = fract(g);
  float frame = max(
    1.0 - smoothstep(0.0, 0.07, min(f.x, 1.0 - f.x)),
    1.0 - smoothstep(0.0, 0.11, min(f.y, 1.0 - f.y))
  );
  float order = hash(cell + 3.7);
  float built = 0.42 + 0.58 * smoothstep(order - 0.2, order + 0.2, extra);
  float shimmer = 0.82 + 0.18 * sin(t * 0.6 + order * 18.0);
  return clamp(frame * built * shimmer, 0.0, 1.0);
}`;

/* Connect — a signal going out: rings expanding from the middle of the
   viewport. The text keep-out clears the centre, so what actually reads is a
   halo of arcs pulsing outward through the margins. */
export const FIELD_CONNECT = `
float field6(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float d = length(p - vec2(uAspect * 0.5, 0.47));
  // Normalised against the corner distance, or the rings die out inside the
  // text keep-out on any wide viewport and nothing is left to see.
  float dn = d / length(vec2(uAspect * 0.5, 0.53));
  float rings = smoothstep(0.3, 1.0, sin(dn * 26.0 - t * 1.15));
  return clamp(rings * (1.0 - 0.45 * dn), 0.0, 1.0);
}`;

export const FIELDS = [
  FIELD_HOME,
  FIELD_ABOUT,
  FIELD_EDUCATION,
  FIELD_SPORTS,
  FIELD_HOBBIES,
  FIELD_PROJECTS,
  FIELD_CONNECT,
];

/* Seven fields, one per section (SECTION_IDS order).

   These are a rewrite. The first set was six line patterns and a noise cloud —
   contour bands, ruled lines, sine lanes, crosshatch, wireframe frames,
   concentric rings — all sampled through one shared ramp of punctuation. The
   result read as "just lines and operation symbols", the same material seven
   times over, and it was reported as such.

   So this set varies the FORM, not the direction of a line:

     home       a cloud of particles condensing toward the pointer
     about      slow marbling — domain-warped tone, no contours
     education  a soft page wash with rules as a faint rhythm inside it
     sports     a broad swell, like light on moving water
     hobbies    tonal stipple, the way a pencil actually shades
     projects   a fill that floods in with scroll depth
     connect    wide soft pulses breathing outward

   and each is drawn in its own character family (atlas.ts), so the material
   differs too. Nothing here should produce a hard edge: prefer wide
   smoothsteps and summed noise over thin high-contrast strokes, because a
   coarse glyph grid turns every hard edge into a staircase.

   Shared signature, so shaders.ts can dispatch uniformly:

     float fieldN(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV)

   p       — aspect-corrected cell UV (x scaled by uAspect), snapped to the grid.
             Use for anything that must stay circular/isotropic on screen.
   t       — seconds since mount, raw. Each field picks its own speed; keep them
             slow. Fast motion in a coarse grid reads as flicker, because cells
             pop between ramp steps rather than sliding.
   mouseOffset — (uMouse - 0.5) * 0.18, spare; only home uses the real cursor.
   extra   — spare per-field driver; only `projects` uses it (scroll depth 0-1).
   rawUV   — un-aspect-corrected cell UV (0..1 both axes). Use for anything that
             should stay pinned to the viewport edges.

   Return roughly 0..1. The text keep-out and the dither are applied centrally
   in shaders.ts, so no field needs to handle either.

   Relies on hash/noise/fbm from the shared preamble in shaders.ts. */

/* Home — the one field that answers the pointer. A drifting particle cloud,
   mostly held back and revealed toward the cursor: near-empty in the margins,
   dense under the pointer. Paired with the brass tint MAIN applies over the
   same halo, that makes the first viewport the only background that responds
   to the visitor. */
export const FIELD_HOME = `
float field0(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.03;
  vec2 warp = p * 1.5;
  warp.x += fbm(p * 2.0 + ts) * 0.6;
  warp.y += fbm(p * 2.0 - ts) * 0.6;
  float base = smoothstep(0.24, 0.88, fbm(warp + ts * 0.5));

  vec2 toCursor = vec2((rawUV.x - uMouse.x) * uAspect, rawUV.y - uMouse.y);
  float halo = smoothstep(0.8, 0.02, length(toCursor));

  // 0.42 away from the pointer, not 0: the margins should read as a faint
  // scatter of characters rather than as nothing at all.
  return clamp(base * (0.42 + 1.3 * halo), 0.0, 1.0);
}`;

/* About — slow marbling. Two octaves of warp folded into each other so the
   tone keeps reorganising without ever resolving into a shape. Replaced a
   contour-band field whose sliced noise was the worst of the line offenders. */
export const FIELD_ABOUT = `
float field1(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.022;
  vec2 q = p * 3.4;
  vec2 warp = vec2(fbm(q + ts), fbm(q + vec2(3.7, 1.9) - ts));
  vec2 r = q + warp * 1.6;
  float tone = fbm(r + warp.yx * 0.7 + ts * 0.6);
  return smoothstep(0.32, 0.68, tone);
}`;

/* Education — a page rather than a ruler. A broad vertical wash carries the
   tone, and the rules are a shallow modulation inside it (±0.16) rather than
   the whole content, so they read as ruled paper seen through paper. */
export const FIELD_EDUCATION = `
float field2(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.03;
  float wash = fbm(vec2(p.x * 1.9, p.y * 4.2 + ts));
  wash = smoothstep(0.33, 0.67, wash);
  float rule = sin(rawUV.y * 42.0) * 0.5 + 0.5;
  float band = 0.55 + 0.45 * sin(rawUV.y * 2.2 - ts * 2.4);
  return clamp(wash * band * (0.84 + 0.16 * rule), 0.0, 1.0);
}`;

/* Sports — a swell. Large low-frequency noise pushed around by two slow sine
   currents, so tone gathers and disperses the way light does on moving water.
   No lane lines: those were thin strokes and read as ruling, not water. */
export const FIELD_SPORTS = `
float field3(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.12;
  vec2 q = p * vec2(2.6, 4.4);
  q.y += sin(p.x * 2.1 - ts) * 0.8;
  q.x += sin(p.y * 1.7 + ts * 0.7) * 0.6;
  float swell = fbm(q + vec2(0.0, ts * 0.25));
  float crest = 0.66 + 0.34 * sin(p.y * 3.4 - ts * 1.3);
  return smoothstep(0.33, 0.67, swell) * crest;
}`;

/* Hobbies — stipple, not hatch. Fine per-cell grain gated by a soft tonal
   gradient, which is how pencil shading actually builds: density of marks
   varying across a smooth value, not crossed lines. The braille ramp does the
   rest — its glyphs are dot patterns, so the grain is in the characters too. */
export const FIELD_HOBBIES = `
float field4(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.018;
  float tone = fbm(p * 2.8 + vec2(ts, -ts * 0.6));
  tone = smoothstep(0.32, 0.7, tone);
  // Grain drifts slowly across the tone rather than sitting still on the grid.
  float grain = noise(p * 26.0 + vec2(ts * 3.0, ts * 2.0));
  return clamp(tone * (0.55 + 0.7 * grain), 0.0, 1.0);
}`;

/* Projects — a flood, not a wireframe. Tone rises from the top of the section
   to the bottom as `extra` (scroll depth through the section) advances, with a
   soft noise front so the edge of the fill is ragged rather than a line. The
   reader draws it by scrolling; the clock only ripples it. */
export const FIELD_PROJECTS = `
float field5(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float ts = t * 0.05;
  float front = fbm(vec2(p.x * 3.2, p.y * 2.4 + ts)) * 0.5;
  // 1 - rawUV.y so the fill climbs from the bottom of the viewport upward.
  float reach = extra * 1.35 - (1.0 - rawUV.y) * 0.95;
  float fill = smoothstep(-0.3, 0.34, reach - front + 0.3);
  float texture = smoothstep(0.3, 0.72, fbm(p * 4.2 - ts * 0.8));
  return clamp(fill * (0.25 + 0.9 * texture), 0.0, 1.0);
}`;

/* Connect — a breath going out. Wide, soft, low-frequency pulses expanding
   from the middle: two waves at different rates so they never beat in step.
   The old version used thin rings, which the glyph grid rendered as dotted
   arcs. */
export const FIELD_CONNECT = `
float field6(vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  vec2 centre = vec2(uAspect * 0.5, 0.47);
  float d = length(p - centre) / length(vec2(uAspect * 0.5, 0.53));
  float wobble = fbm(p * 3.0 + t * 0.02) * 0.16;
  float pulse = sin((d + wobble) * 7.0 - t * 0.5) * 0.5 + 0.5;
  float slow  = sin((d + wobble) * 4.2 - t * 0.32) * 0.5 + 0.5;
  float wave = smoothstep(0.15, 0.95, pulse * 0.6 + slow * 0.6);
  return clamp(wave * (1.0 - 0.45 * d), 0.0, 1.0);
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

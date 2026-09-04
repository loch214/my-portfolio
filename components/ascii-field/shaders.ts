import { FIELDS } from './fields';


/* Reused verbatim from the hero's original aura: a single oversized triangle,
   no vertex transform beyond passthrough. */
export const VERT = `#version 100
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const PREAMBLE = `#version 100
precision highp float;
uniform vec2 uResolution;
uniform float uAspect;
uniform vec2 uGridSize;
uniform sampler2D uAtlas;
uniform float uRampCount;
uniform float uAtlasRows;
uniform float uFieldGain;
uniform float uFieldBias;
uniform float uTime;
uniform vec2 uMouse;
uniform float uFieldA;
uniform float uFieldB;
uniform float uTransition;
uniform float uProjectsProgress;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uWarmth;
uniform vec2 uMaskCenter;
uniform float uMaskHalfWidth;
uniform float uMaskHalfHeight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p *= 2.02;
    amp *= 0.52;
  }
  return value;
}
`;

/* GLSL ES 1.00 has no switch/array-of-functions, so field selection is an
   if/else ladder over a float index (uFieldA/uFieldB, rounded). */
const DISPATCH = `
float evalField(float idx, vec2 p, float t, vec2 mouseOffset, float extra, vec2 rawUV) {
  float result = 0.0;
${FIELDS.map((_, i) => `  ${i === 0 ? 'if' : 'else if'} (idx < ${i}.5) result = field${i}(p, t, mouseOffset, extra, rawUV);`).join('\n')}
  return result;
}
`;

const MAIN = `
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  vec2 cellIdx = floor(uv * uGridSize);
  vec2 cellUV = (cellIdx + 0.5) / uGridSize;
  vec2 local = fract(uv * uGridSize);

  vec2 p = cellUV;
  p.x *= uAspect;
  vec2 mouseOffset = (uMouse - 0.5) * 0.18;

  // Text keep-out: an ellipse over this section's copy. Centre and both radii
  // are interpolated per section, because the hero's copy is a left-aligned
  // block rather than a centred column — reusing the sections' viewport-centred
  // ellipse there cleared almost the entire screen and left the cursor halo
  // nowhere to live.
  vec2 offset = vec2(
    (uv.x - uMaskCenter.x) / uMaskHalfWidth,
    (uv.y - uMaskCenter.y) / uMaskHalfHeight
  );
  // 1.0 -> 1.4, not 1.05 -> 1.85: the wider ramp cleared out to nearly twice
  // the ellipse's radii, which on the hero swallowed the whole viewport at mid
  // height and starved the cursor halo. Text is still fully clear inside 1.0.
  float clearance = smoothstep(1.0, 1.4, length(offset));

  float lum = evalField(uFieldA, p, uTime, mouseOffset, uProjectsProgress, cellUV);
  if (uTransition > 0.0) {
    float lumB = evalField(uFieldB, p, uTime, mouseOffset, uProjectsProgress, cellUV);
    lum = mix(lum, lumB, uTransition);
  }
  lum = clamp(lum, 0.0, 1.0) * clearance;

  /* Per-field gain and bias (FIELD_LEVELS in theme.ts), interpolated across a
     section change like everything else. fbm's output clusters around 0.48
     with a fairly narrow spread, and each field composes it differently, so
     the raw returns land all over the place — two of the seven originally
     rendered nothing at all while another flooded half the viewport. Tuning
     the level here, against measured ink coverage, is far more reliable than
     hand-fitting a smoothstep window inside every field. */
  lum = clamp(lum * uFieldGain + uFieldBias, 0.0, 1.0);

  /* Ordered-ish dither, one ramp step wide and keyed to the cell so it never
     flickers. Eight discrete density levels otherwise band visibly: each
     boundary lands as a hard contour of identical characters. Jittering the
     luminance by half a step either way dissolves those boundaries into a mix
     of the two neighbouring glyphs, which is what reads as a smooth gradient
     rather than as a set of terraces. */
  lum = clamp(lum + (hash(cellIdx + 11.3) - 0.5) / uRampCount, 0.0, 0.999);

  /* Each section has its own character family, one atlas row per section
     (atlas.ts). Both rows are sampled and cross-faded on the same eased factor
     as the field itself, so a section change morphs the material as well as
     the pattern. local.y is flipped because texture row 0 is the top of the
     baked canvas while gl_FragCoord.y counts up from the bottom. */
  /* Scatter each mark off the centre of its cell. With every glyph centred,
     a low-density field of round characters reads as a regular polka-dot
     screen — you see the lattice, not the field. A per-cell offset (static, so
     it never shimmers) breaks the grid up. Clamped to the cell so a shifted
     glyph can never sample the neighbouring ramp step. */
  vec2 jitter = (vec2(hash(cellIdx + 5.1), hash(cellIdx + 9.7)) - 0.5) * 0.34;
  vec2 cellLocal = clamp(local + jitter, 0.0, 1.0);

  float glyphIdx = floor(lum * uRampCount);
  float atlasU = (glyphIdx + cellLocal.x) / uRampCount;
  float cellV = 1.0 - cellLocal.y;
  float maskA = texture2D(uAtlas, vec2(atlasU, (uFieldA + cellV) / uAtlasRows)).a;
  float glyphMask = maskA;
  if (uTransition > 0.0) {
    float maskB = texture2D(uAtlas, vec2(atlasU, (uFieldB + cellV) / uAtlasRows)).a;
    glyphMask = mix(maskA, maskB, uTransition);
  }

  // Cursor halo, hero only: uWarmth is 1 there and 0 everywhere else, so no
  // other section pays for this and the warmth fades out as you scroll off.
  // The accent is taken down to 0.55 on purpose — at full strength the brass
  // sits brighter than the body copy, which is not what a background should do.
  float halo = 0.0;
  if (uWarmth > 0.001) {
    vec2 toCursor = vec2((cellUV.x - uMouse.x) * uAspect, cellUV.y - uMouse.y);
    halo = smoothstep(0.6, 0.0, length(toCursor)) * uWarmth;
  }
  vec3 ink = mix(uInk, uAccent * 0.55, halo * 0.9);

  /* 0.5 rather than 0.85: the ramps now top out in dither and solid blocks
     (▓ covers 71% of its cell, █ 84%) where the old punctuation ramp peaked at
     # covering 13%. Same alpha would have made the field several times heavier
     than it has any business being. */
  float alpha = glyphMask * (0.5 + 0.2 * halo);
  // The context is created with premultipliedAlpha: true, so RGB has to be
  // scaled by alpha here. Emitting unpremultiplied colour washes the whole
  // viewport flat regardless of the pattern underneath.
  gl_FragColor = vec4(ink * alpha, alpha);
}
`;

export function buildFragmentShader(): string {
  return PREAMBLE + FIELDS.join('\n') + DISPATCH + MAIN;
}

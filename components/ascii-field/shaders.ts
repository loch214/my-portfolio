import { FIELDS } from './fields';
import { GLYPH_RAMP } from './atlas';

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
uniform float uTime;
uniform vec2 uMouse;
uniform float uFieldA;
uniform float uFieldB;
uniform float uTransition;
uniform float uProjectsProgress;
uniform vec3 uInk;
uniform vec3 uAccent;
uniform float uGlyphMix;
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

/* The hero's smoke, evaluated per pixel rather than per glyph cell — this is
   the one part of the background that is deliberately NOT ASCII. Same
   domain-warped fbm and the same brass tint the standalone HeroAura used
   before the field system absorbed it. */
float smoke(vec2 uv) {
  vec2 p = uv;
  p.x *= uAspect;
  vec2 mouseOffset = (uMouse - 0.5) * 0.18;
  float t = uTime * 0.045;

  vec2 warp = p * 1.6 + mouseOffset;
  warp.x += fbm(p * 2.2 + t) * 0.7;
  warp.y += fbm(p * 2.2 - t) * 0.7;

  float n = smoothstep(0.18, 0.92, fbm(warp + t * 0.5));
  float centerDist = length((uv - vec2(0.5, 0.42)) * vec2(uAspect, 1.0));
  return n * smoothstep(0.95, 0.1, centerDist);
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

  // Text keep-out: an ellipse over the content column, sized per section from
  // uMaskHalfWidth/uMaskHalfHeight. 0 behind the copy, 1 out in the margins.
  // Every field is full-viewport now, so this is applied centrally rather than
  // being each field's problem.
  float maskDist = length(vec2((uv.x - 0.5) / uMaskHalfWidth, (uv.y - 0.5) / uMaskHalfHeight));
  float clearance = smoothstep(1.05, 1.85, maskDist);

  vec4 color = vec4(0.0);

  // ── ASCII branch. Both tests are on uniforms, so a section that is purely
  //    one or the other never pays for the other's arithmetic.
  if (uGlyphMix > 0.001) {
    vec2 cellIdx = floor(uv * uGridSize);
    vec2 cellUV = (cellIdx + 0.5) / uGridSize;
    vec2 local = fract(uv * uGridSize);

    vec2 p = cellUV;
    p.x *= uAspect;
    vec2 mouseOffset = (uMouse - 0.5) * 0.18;

    float lum = evalField(uFieldA, p, uTime, mouseOffset, uProjectsProgress, cellUV);
    if (uTransition > 0.0) {
      float lumB = evalField(uFieldB, p, uTime, mouseOffset, uProjectsProgress, cellUV);
      lum = mix(lum, lumB, uTransition);
    }
    lum = clamp(lum, 0.0, 1.0) * clearance;

    // Pick a character off the ramp by brightness, then sample its own cell in
    // the atlas. local.y is flipped because texture row 0 is the top of the
    // baked canvas while gl_FragCoord.y counts up from the bottom.
    //
    // The ramp is deliberately cut two characters short of its top end: % and
    // @ have near-total ink coverage, so wherever a field peaked they stopped
    // reading as characters and turned into solid slabs that pulled the eye
    // straight off the copy. # is the densest glyph that still reads as type.
    float glyphIdx = floor(clamp(lum, 0.0, 0.999) * (uRampCount - 2.0));
    float atlasU = (glyphIdx + local.x) / uRampCount;
    float glyphMask = texture2D(uAtlas, vec2(atlasU, 1.0 - local.y)).a;

    float alpha = glyphMask * 0.85 * uGlyphMix;
    color += vec4(uInk * alpha, alpha);
  }

  // ── Smoke branch (hero only).
  if (uGlyphMix < 0.999) {
    float glow = smoke(uv) * (1.0 - uGlyphMix);
    color += vec4(uAccent * glow * 0.85, glow * 0.9);
  }

  // The context is created with premultipliedAlpha: true, so RGB is already
  // scaled by alpha above. Emitting unpremultiplied colour here washes the
  // whole viewport flat regardless of the pattern underneath.
  gl_FragColor = color;
}
`;

export function buildFragmentShader(): string {
  return PREAMBLE + FIELDS.join('\n') + DISPATCH + MAIN;
}

export const RAMP_COUNT = GLYPH_RAMP.length;

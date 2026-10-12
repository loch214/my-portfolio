import {
  CONTOUR_LEVELS,
  TERRAIN_SCALE,
  CURSOR_RADIUS,
  GRAIN_STRENGTH,
  GRAIN_CELL_CSS_PX,
} from './theme';

/* GLSL ES 3.00 (WebGL2) rather than 1.00: the contour lines need fwidth() for
   a constant on-screen stroke width at any zoom, and the grain needs integer
   hashing — a float sin/fract hash showed a visible diagonal lattice in the
   grain at this amplitude. */

const f = (n: number) => n.toFixed(4);

/* A single oversized triangle generated from gl_VertexID — no vertex buffer. */
export const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = `#version 300 es
precision highp float;

uniform vec2 uResolution;   // device px
uniform float uPixelRatio;
uniform float uTime;
uniform float uScroll;      // scrollY in viewport heights, already parallax-scaled
uniform vec2 uMouse;        // device px, y up
uniform float uMouseOn;     // 0..1, fades in on first mouse move, out on leave
uniform vec2 uMaskCenter;   // viewport fractions, y up
uniform float uMaskHalfWidth;
uniform float uMaskHalfHeight;
uniform float uMaskFloor;   // how much map survives inside the keep-out
uniform vec3 uGround;
uniform vec3 uInk;
uniform vec3 uAccent;

out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

/* Three octaves on purpose. Five read as a map of noisy islands; three gives
   the broad, slow hills a real survey map has. */
float fbm3(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.42;
  }
  return v;
}

float grain(vec2 p, float frame) {
  uvec3 v = uvec3(uvec2(p), uint(frame));
  v = v * 1664525u + 1013904223u;
  v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
  v ^= v >> 16u;
  v.x += v.y * v.z; v.y += v.z * v.x;
  return float(v.y) / 4294967295.0;
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uResolution;

  // Text keep-out: an ellipse over this section's copy, interpolated across
  // a section change (ContourField.tsx). Lines fade to almost nothing inside
  // it, so the copy always sits on clean ground.
  vec2 offset = vec2((uv.x - uMaskCenter.x) / uMaskHalfWidth, (uv.y - uMaskCenter.y) / uMaskHalfHeight);
  float clearance = smoothstep(0.95, 1.45, length(offset));

  // Cursor loupe.
  float m = uMouseOn * exp(-pow(length(px - uMouse) / (uResolution.y * ${f(CURSOR_RADIUS)}), 2.0));

  // One continuous terrain; scrolling travels across it, so a section change
  // is a pan across the same map, never a cut.
  vec2 p = px / uResolution.y * ${f(TERRAIN_SCALE)};
  p.y -= uScroll * ${f(TERRAIN_SCALE)};
  p -= (px - uMouse) / uResolution.y * 0.3 * m;         // the map swells gently under the cursor

  vec2 q = p * 0.38 + vec2(uTime * 0.01, 0.0);
  float h = fbm3(q + 0.35 * vec2(fbm3(q * 0.7 + 3.1 + uTime * 0.006), fbm3(q * 0.7 - 1.7)));

  float level = h * ${f(CONTOUR_LEVELS)};
  float dist = (0.5 - abs(fract(level) - 0.5)) / fwidth(level);
  float line = 1.0 - smoothstep(0.4 + 0.5 * m, 1.4 + 0.8 * m, dist);   // a little thicker near the cursor
  float major = mod(floor(level + 0.5), 5.0) < 0.5 ? 1.0 : 0.5;         // every fifth line is an index contour

  // The brass ramps in with smoothstep rather than linearly, so the loupe has
  // a soft shoulder instead of a hard rim the eye catches as it moves.
  vec3 lineColor = mix(uInk, uAccent * 1.1, smoothstep(0.0, 0.9, m));
  // Inside the keep-out the map survives at uMaskFloor (content cards are
  // slightly translucent and show it faintly); the cursor's extra brightness
  // stays almost fully suppressed there, so it never lights up behind text.
  float alpha = line * (0.42 * major * mix(uMaskFloor, 1.0, clearance)
                      + 0.6 * m * mix(0.06, 1.0, clearance));
  vec3 col = mix(uGround, lineColor, clamp(alpha, 0.0, 1.0));
  col += uAccent * 0.035 * m * clearance;                              // faint warm pool under the cursor

  col += (grain(floor(px / (uPixelRatio * ${f(GRAIN_CELL_CSS_PX)})), floor(uTime * 24.0)) - 0.5) * ${f(GRAIN_STRENGTH)};

  vec2 v = uv - 0.5;
  col *= 1.0 - 0.35 * dot(v, v);                                       // soft lens vignette

  outColor = vec4(col, 1.0);
}`;

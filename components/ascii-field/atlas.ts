/* Bakes the glyph ramps into one offscreen canvas at mount: RAMP_LEN columns
   (light → dense) by one row per section. The fragment shader samples it as a
   texture and reads the alpha channel as the glyph mask — colour is applied
   entirely in the shader, so the same atlas serves every field.

   Each section gets its OWN character family, not just its own arrangement of
   a shared one. The first version used a single ramp of ' .:-=+*#' for all
   seven, which is punctuation and maths operators end to end, so every section
   was visibly the same material and read as "just lines and symbols". These
   families are picked for tone instead: dither blocks, partial blocks, braille
   and geometric circles all render as smooth density rather than as glyphs you
   read.

   The cell is deliberately taller than it is wide, the same proportion a
   character occupies in a terminal line box. GRID_CELL_* in AsciiField.tsx
   must keep the same ratio or the glyphs sample stretched. */

export const GLYPH_CELL_W = 44;
export const GLYPH_CELL_H = 80;

/* Every ramp is exactly this long, light to dense, starting from a space.
   Repeat the last character to pad a shorter family. */
export const RAMP_LEN = 8;

/* Ordered by SECTION_IDS: home, about, education, sports, hobbies, projects,
   connect. Coverage figures measured in the browser with the atlas font, so
   each ramp actually rises in density rather than only looking like it should.

   None of these live in Fragment Mono itself — they resolve through the
   fallback chain to the platform mono (Consolas, Menlo, DejaVu Sans Mono),
   which is why RAMP_FAMILIES exists below: if a family is not available the
   section falls back to an ASCII ramp rather than rendering a row of tofu. */
export const SECTION_RAMPS = [
  ' ·:◦°○●▒', // home       — dots condensing into shade
  ' ⋅∙⁚‥⋯∴∷', // about      — dot clusters, growing by count not size
  ' ·¯─│┼▒▓', // education  — rules thickening to solid
  ' ·▁▂▃▅▆▇', // sports     — rising water level
  ' ⠁⠃⠇⠏⠟⠿⣿', // hobbies    — pencil grain
  ' ·▗▖▚▞▙█', // projects   — corner quadrants filling in
  ' ·°◦○●▒▓', // connect    — pulse rings
];

/* Which Unicode block each ramp depends on, with a sentinel to probe and an
   all-ASCII stand-in for fonts that can't draw it.

   The low end of each ramp is what matters. Field density targets ~6.5% of
   cells carrying a glyph, so in practice only steps 1-3 are ever reached and
   the dense top of each ramp is nearly decorative — which is why the families
   are chosen to differ in their SMALLEST mark: a centred dot, a vertical
   sliver, a horizontal rule, a bottom bar, a braille cluster, a corner square,
   a hollow ring. Cell-filling blocks are deliberately kept off the low end;
   scattered solid squares read as a lattice, where small marks read as grain. */
const RAMP_FAMILIES: Array<{ rows: number[]; sentinel: string; fallback: string }> = [
  { rows: [0, 6], sentinel: '●', fallback: ' .:ooO00' }, // geometric circles
  { rows: [1], sentinel: '∷', fallback: ' .,:;...' }, // dot clusters
  { rows: [2], sentinel: '─', fallback: ' .-=+|##' }, // box drawing
  { rows: [3], sentinel: '▃', fallback: ' .___===' }, // lower part-blocks
  { rows: [4], sentinel: '⠿', fallback: " .'\":;ii" }, // braille
  { rows: [5], sentinel: '▚', fallback: ' .,:*+#@' }, // quadrant blocks
];

/* Does the font actually draw this character, or is it a notdef box? Compared
   against a private-use codepoint, which is guaranteed to have no glyph. */
function coverageKey(ctx: CanvasRenderingContext2D, size: number, ch: string) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillText(ch, size / 2, size / 2);
  const data = ctx.getImageData(0, 0, size, size).data;
  let key = '';
  for (let cell = 0; cell < 16; cell++) {
    const cx = (cell % 4) * (size / 4);
    const cy = Math.floor(cell / 4) * (size / 4);
    let ink = 0;
    for (let y = cy; y < cy + size / 4; y += 2) {
      for (let x = cx; x < cx + size / 4; x += 2) {
        if (data[(y * size + x) * 4 + 3] > 40) ink++;
      }
    }
    key += ink > 4 ? '1' : '0';
  }
  return key;
}

export function resolveRamps(fontFamily: string): string[] {
  const ramps = [...SECTION_RAMPS];
  const size = 48;
  const probe = document.createElement('canvas');
  probe.width = size;
  probe.height = size;
  const ctx = probe.getContext('2d');
  if (!ctx) return ramps;

  ctx.fillStyle = '#fff';
  ctx.font = `${Math.round(size * 0.8)}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const notdef = coverageKey(ctx, size, String.fromCodePoint(0xe000));
  RAMP_FAMILIES.forEach(({ rows, sentinel, fallback }) => {
    if (coverageKey(ctx, size, sentinel) !== notdef) return;
    rows.forEach((row) => {
      ramps[row] = fallback;
    });
  });
  return ramps;
}

export function buildGlyphAtlas(fontFamily: string, ramps: string[]): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = RAMP_LEN * GLYPH_CELL_W;
  canvas.height = ramps.length * GLYPH_CELL_H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(GLYPH_CELL_H * 0.82)}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ramps.forEach((ramp, row) => {
    for (let step = 0; step < RAMP_LEN; step++) {
      const char = ramp[Math.min(step, ramp.length - 1)];
      const cx = step * GLYPH_CELL_W + GLYPH_CELL_W / 2;
      const cy = row * GLYPH_CELL_H + GLYPH_CELL_H / 2 + 2;
      ctx.fillText(char, cx, cy);
    }
  });

  return canvas;
}

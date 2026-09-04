/* Bakes a density-ordered glyph ramp into an offscreen canvas once, at mount.
   The fragment shader samples this as a texture and reads its alpha channel as
   the glyph mask — colour is applied entirely in the shader, not baked here,
   so the same atlas works for every field.

   The cell is deliberately taller than it is wide (roughly 1 : 1.8, the same
   proportion a monospace character occupies in a terminal line box). A square
   cell was what made the old field read as a dot grid rather than as text:
   glyphs came out squat and evenly spaced in both axes, which is not what
   typed characters look like. GRID_CELL_* in AsciiField.tsx must keep the same
   ratio or the glyphs sample stretched. */

export const GLYPH_RAMP = ' .:-=+*#%@';
export const GLYPH_CELL_W = 44;
export const GLYPH_CELL_H = 80;

export function buildGlyphAtlas(fontFamily: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GLYPH_RAMP.length * GLYPH_CELL_W;
  canvas.height = GLYPH_CELL_H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(GLYPH_CELL_H * 0.82)}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < GLYPH_RAMP.length; i++) {
    const cx = i * GLYPH_CELL_W + GLYPH_CELL_W / 2;
    ctx.fillText(GLYPH_RAMP[i], cx, GLYPH_CELL_H / 2 + 2);
  }

  return canvas;
}

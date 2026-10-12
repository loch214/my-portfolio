import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';

/* The Video.js 10 player skin (components/VideoEmbed.tsx), served as a static
   stylesheet built once at `next build`.

   It can't simply be imported. The skin is authored for Tailwind v4's native
   cascade layers (`@layer base`, `@layer components`, a bare `@layer utilities;`
   statement); this project is on Tailwind v3, which runs on every imported
   stylesheet, crashes on the bare statement, and — inlined — would treat the
   skin's `components` layer as purgeable and drop every rule whose class isn't
   in our own source.

   Linking it as-is wouldn't work either: Tailwind v3's output is unlayered, and
   unlayered CSS beats layered CSS regardless of specificity, so preflight's
   `button { background-color: transparent }` would override the skin's buttons.
   So the layer wrappers are unwrapped here: the skin becomes plain CSS that
   competes on specificity and source order like everything else, and it is
   linked after the app stylesheet, so it wins the ties. */

export const dynamic = 'force-static';

const SKIN = path.join(
  process.cwd(),
  'node_modules/@videojs/react/dist/default/presets/video/skin.css'
);

const unwrapLayers: postcss.Plugin = {
  postcssPlugin: 'unwrap-layers',
  AtRule: {
    layer(rule) {
      if (rule.nodes && rule.nodes.length > 0) rule.replaceWith(rule.nodes);
      else rule.remove();
    },
  },
};

export async function GET() {
  const source = await readFile(SKIN, 'utf8');
  const { css } = await postcss([unwrapLayers]).process(source, { from: undefined });
  return new Response(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      // Fixed URL, so no `immutable`: a package update must reach visitors.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

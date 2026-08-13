# Applying the Organic design system to a static site

This folder is a drop-in package for restyling an existing static website with the Organic design system.

## What's here

- `styles.css` — the only stylesheet. Design tokens (`:root` CSS variables) plus a component layer. It `@import`s Caprasimo + Figtree from Google Fonts, so no extra font tags are needed.
- `organic-guide.md` — the written rules: direction, color, type, icons, states, class list, do/don't. **The most important file for Claude Code to read.**
- `theme.json` — machine-readable record of the theme parameters.
- `reference/*.html` — live reference pages. Each one is plain HTML that links `../styles.css`; open them in a browser to see the intended markup and result. These are *references*, not code to copy into the site wholesale.

## How to do it

1. Copy `styles.css` into your site's repo (e.g. `assets/css/organic.css`) and copy `organic-guide.md` and `theme.json` next to it, or into a `design/` folder.
2. Link the stylesheet from every page, after (or instead of) your existing CSS:
   ```html
   <link rel="stylesheet" href="/assets/css/organic.css">
   ```
3. Remove or trim your old stylesheet. Organic sets base type, background and text color on `body`, so leftover rules will fight it.
4. Restyle your markup using the existing classes (`.btn`, `.card`, `.nav`, `.tag`, `.input`, `.table`, `.washed`, …). Do not invent parallel classes or hard-code hex values, font names or px sizes the tokens already carry.
5. Wrap every content photograph in `.washed`.

If your site is built with a generator (Jekyll, Hugo, Astro, 11ty), step 2 usually means editing one layout/base template rather than every page.

## Prompt for Claude Code

Put this folder inside the repo (or alongside it) and paste this into Claude Code:

> I want to restyle this static site with the Organic design system in `design_handoff_organic/`.
>
> First read `design_handoff_organic/organic-guide.md` end to end, then skim `design_handoff_organic/styles.css` so you know every token and class that exists. The `reference/*.html` files show the intended markup for each component — open or read them when you need to know how a component is structured.
>
> Then:
> 1. Show me a plan first: which of my pages/layouts you'll touch, which existing CSS you'll delete, and which Organic classes each part of my site maps to. Wait for my approval.
> 2. Install `styles.css` into the repo and link it from the site's base layout.
> 3. Convert my existing markup page by page. Reuse the Organic classes; never hard-code a color, font, radius, shadow or spacing value that a `var(--…)` token already provides. Don't add new components — if something in my site has no Organic equivalent, compose it from existing tokens and tell me.
> 4. Delete the old stylesheet rules you've replaced. Don't leave dead CSS.
> 5. Keep my content and copy exactly as it is. This is a restyle, not a rewrite.
>
> Constraints from the guide that matter most: left-aligned asymmetric layouts, over-rounded containers (`--radius-lg`) with pill buttons (`border-radius: 999px`), Caprasimo headings over Figtree body, `.washed` on every photograph, themed hover/pressed/`:focus-visible` states (never browser defaults), no sharp corners or hairline geometry, and plenty of whitespace.
>
> Run the site locally when you're done and show me the result.

## Notes

- Contrast: the accent-on-ground pair is tuned to ~3:1 — fine for icons, large text and chrome, not for body copy. Use `--color-accent-700` for paragraph-size accent text.
- Icons: Lucide (https://lucide.dev) at stroke-width 2.75.
- To retune the look later, edit the tokens at the top of `styles.css`; everything downstream reads from them.

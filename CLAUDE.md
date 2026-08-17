# Personal portfolio — Lochana Dahanayake

Next.js 14 App Router + TypeScript + Tailwind, deployed on Vercel. One scrolling
page (`app/page.tsx`) with seven full-screen sections, plus `/gallery` and
`/projects/[id]` routes. All content lives in `data/personalData.ts` — no CMS.

## Swapping the theme

The current look (as of the 2026-08 redesign) is dark cinematic editorial: a
near-black ground (`#0a0a09`), a single warm-brass accent (`#c9a24b`), an oversized
italic display serif over small tracked mono labels, hairline-bordered panels
(no pill cards, no dual accent hue). It replaced an earlier warm-cream / terracotta
/ sage system that came from a Claude design handoff (the `Organic/` folder —
deleted); nothing from that system carried forward. `PRODUCT.md` records the product
truth this redesign preserved; there is no DESIGN.md yet.

The look is fully tokenised, so a theme rework is three edits:

1. **`app/globals.css`** — the `:root` token block at the top. Colors
   (`--color-bg`, `--color-surface`, `--color-text`, `--color-accent*`,
   `--color-accent-2*`, `--color-neutral-*`), radii, shadows, spacing. Below it sit
   the shared utilities (`.card`, `.kicker`, `.body-text`, `.washed`/`.washed-reveal`,
   `.elev-*`, `.snap-section`, `.anim-float*`) — restyle these rather than
   sprinkling new classes at call sites.
2. **`app/layout.tsx`** — the three `next/font/google` faces bound to
   `--font-heading` (display serif), `--font-body`, and `--font-mono` (small tracked
   labels — `.kicker`, chips, buttons).
3. **`tailwind.config.ts`** — only if the token *names* change. Every entry there is
   a `var(--…)` reference; keep it that way.

`components/HeroAura.tsx` (the hero's raw-WebGL shader) is the one place color
isn't CSS: it reads `--color-accent` via `getComputedStyle` at mount and converts
it to RGB floats for the shader uniform, so it still retints from the token without
a hardcoded hex. There is no illustration file to retint — the redesign dropped the
old flat-SVG character scenes entirely rather than reskin them; sections now carry
themselves on type, motion, and whitespace.

After a theme change, grep for a bare hex outside the `:root` block and outside that
one `getComputedStyle` conversion in `HeroAura.tsx`. A literal colour anywhere else
is a bug.

## Structure worth knowing before editing

- **Section ids** are fixed in `hooks/useActiveSection.ts` (`SECTION_IDS`).
  `components/SectionNav.tsx` (right-rail dots) and `components/Navigation.tsx`
  (drawer) both read from it. Renaming an id means touching all three.
- **Scroll behaviour is custom.** `components/SmoothSectionScroll.tsx` intercepts
  wheel/key input and animates section-to-section with an eased rAF loop (~950ms,
  Apple-like). It disables CSS snap on mount and bails out entirely for touch
  pointers and `prefers-reduced-motion`, which fall back to the CSS
  `scroll-snap-type` in `globals.css`. The duration and easing were tuned by hand —
  treat them as settled unless asked.
- **Overlays** must call `useScrollLock` (`hooks/useScrollLock.ts`) and carry
  `overscroll-contain`, or the page scrolls behind them. `SmoothSectionScroll` also
  exempts anything inside `[role="dialog"]` or `[data-native-scroll]`.
- **`css.d.ts`** declares `*.css` so TS 6+ doesn't flag the `globals.css`
  side-effect import (TS2882) — Next only ships types for `*.module.css`. Keep it.
- **`components/HeroAura.tsx`** is the hero's signature motion: a dependency-free
  raw-WebGL (not three.js) fullscreen-triangle shader — domain-warped fbm noise,
  colorized from the accent token, drifting toward the pointer. Falls back to a
  static CSS radial gradient (rendered by `Hero.tsx`) when WebGL is unavailable, and
  renders one static frame instead of animating under `prefers-reduced-motion`.
- **`components/CharacterReveal.tsx`** is the reusable per-character type reveal
  (used for the hero name) — framer-motion stagger, no gsap dependency. Respects
  `prefers-reduced-motion` by rendering the plain text with no animation.

## Standing constraints from the owner

Decisions already made and re-confirmed. Don't relitigate them.

- **Restyle, don't rewrite logic.** Theme work touches styling and copy, not
  behaviour.
- **The blurred translucent nav bar stays as it is.**
- **The Projects section is allowed to exceed the viewport** — it keeps growing and
  can't be forced to fit. Every other section should fit a 900px-tall viewport.
- **Copy tone:** plain, natural, understated. It must not read as AI-generated, as
  overly casual, or as boastful. He is a software engineering student who builds
  things for fun and explores AI and cyber security on the side — he is *not* a
  musician, and copy shouldn't lean on "my degree is software engineering" as a
  framing device.
- Body text is deliberately larger and heavier than a default (`.body-text` =
  weight 500) because the earlier setting was hard to read.

## Verifying a change

```
npm run dev     # localhost:3000
npx tsc --noEmit
npm run build
```

**Never run `npm run build` while `next dev` is running.** Both write `.next/`, and
the dev server then serves broken CSS with nonsense computed layout values. If
measurements suddenly look absurd: kill dev, `rm -rf .next`, restart.

Dev-mode first compile is slow — headless-browser checks need a 14–15s load wait.

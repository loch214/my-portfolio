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

## Typography — use the scale, never a raw size

Type drifted to 19 different sizes once, and the owner reported the result as
"hard to read / like a mess" **twice**. It now runs on **eight sizes** in the
`:root` block, each exposed as one `.t-*` utility in `globals.css` that owns
family + size + weight + leading + tracking + measure together:

| Utility | Size | Face | Used for |
|---|---|---|---|
| `.t-display` | clamp 44→112px | serif | hero name only |
| `.t-h2` | clamp 28→38px | serif | section + page titles |
| `.t-wordmark` | 20px | serif italic | nav wordmark only |
| `.t-h3` | 20px | grotesk 600 | card titles, modal title |
| `.t-h4` | 17px | grotesk 600 | component titles |
| `.t-lead` | 18px | grotesk 500 | section intro paragraphs |
| `.body-text` | 16px | grotesk 500 | all body copy |
| `.t-meta` | 14px | grotesk 500 | locations, durations, captions, chips |
| `.t-btn` | 14px | grotesk 600 | every button/link label, sentence case |
| `.t-data` / `.kicker` | 13px | **mono** | years, counters, index badges, short labels |

Four rules, every one of them a bug that actually shipped:

- **The serif never appears under 28px** except in `.t-wordmark` (a two-word known
  name, recognised as a shape rather than read). Instrument Serif is high-contrast
  and its thin strokes fall apart in light-on-dark at small sizes. Content
  headings are grotesk — that is what `.t-h3` / `.t-h4` are for.
- **Mono is for data and short labels only** — years, counters, index badges,
  1–3-word uppercase kickers. Never prose, never button text. Shipping
  "Commerce Stream · Colombo 7, Sri Lanka" in mono, and buttons in uppercase
  tracked mono, was the single biggest readability regression here: mono prose
  reads slower, and uppercase + letter-spacing destroys word shape.
- **Measure is capped in the utility, not at the call site.** `.t-lead`,
  `.body-text` and `.t-meta` all carry `max-width: var(--measure)` (68ch),
  because relying on per-call-site `max-w-[65ch]` meant the cards that were
  missed ran to 101–124 characters per line. Use `max-w-none` to opt out
  deliberately (e.g. a figure caption).
- **`--color-neutral-500` is the darkest neutral allowed on text** (≈5:1 on the
  ground). 600–900 are structure only: borders, wells, fills. `text-neutral-600`
  on the background is 2.4:1 and shipped once by accident.

Also: `--color-bg` is deliberately `#121110`, not near-pure black. Light text at
~13:1 on `#0a0a09` halates and shimmers, worse on Windows where
`-webkit-font-smoothing` is a no-op and ClearType adds subpixel colour fringing.
Don't "clean it up" back to `#0a0a09`.

So: **no `text-[13px]`, no `text-xl`, no bare `font-heading`/`font-mono` at call
sites.** Add a role if one is genuinely missing; don't reintroduce one-off sizes.
`grep -rn "text-\[[0-9]" app components` should stay empty, and a quick check
that nothing regressed is that the home page reports **9 size/face combos** and a
widest prose line of **68ch**.

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
- **Nothing on the scroll hot path may touch layout.** This is what caused a real,
  reported "scrolling feels laggy". The wheel listener has to be non-passive (it
  calls `preventDefault` to take the scroll over), so it sits on the critical path
  of every wheel event — and trackpads fire 60–120/s. Reading `offsetTop` /
  `offsetHeight` / `scrollHeight` / `getBoundingClientRect()` there forces a
  synchronous reflow each time. `SmoothSectionScroll` therefore measures section
  geometry once into a cache and re-measures only on `resize`, a `ResizeObserver`
  on `body`, and `document.fonts.ready`. Same rule for `pointermove` handlers.
  Budget to stay under: ~0.01ms per wheel event, 60fps with zero long tasks during
  a section animation.
- **Expensive always-on visuals must idle.** `HeroAura` gates its rAF loop on an
  `IntersectionObserver` (stops once the hero is off-screen), on tab visibility,
  and on the `sectionscroll:start` / `sectionscroll:end` events
  `SmoothSectionScroll` exports — so the shader is not shading a full-viewport
  quad while the page is already spending a frame budget on the scroll animation.
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
  16px / weight 500) because the earlier setting was hard to read. Readability has
  now been raised twice on this complaint — don't quietly shrink type back down.
- **One shared type scale, applied everywhere.** Explicitly asked for after sizes
  drifted apart across sections; see the Typography section above.

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

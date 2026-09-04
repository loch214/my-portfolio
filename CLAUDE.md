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
   the shared utilities (`.card`, `.btn*`, `.chip`, `.kicker`, `.body-text`,
   `.washed`/`.washed-reveal`, `.elev-*`, `.snap-section`, `.anim-float*`) —
   restyle these rather than sprinkling new classes at call sites.
2. **`app/layout.tsx`** — the three `next/font/google` faces bound to
   `--font-heading` (display serif), `--font-body`, and `--font-mono` (small tracked
   labels — `.kicker`, chips, buttons).
3. **`tailwind.config.ts`** — only if the token *names* change. Every entry there is
   a `var(--…)` reference; keep it that way.

`components/AsciiField.tsx` (the shared raw-WebGL background) is the one place color
isn't CSS: it reads `--color-field` (the ASCII glyph ink) and `--color-accent` (the
hero smoke) via `getComputedStyle` at mount and converts them to RGB floats for the
shader uniforms, so both still retint from tokens without a hardcoded hex. There is
no illustration file to retint — the redesign dropped the old flat-SVG character
scenes entirely rather than reskin them; sections now carry themselves on type,
motion, whitespace, and the glyph field behind them.

After a theme change, grep for a bare hex outside the `:root` block and outside the
`readRgb` conversions in `AsciiField.tsx`. A literal colour anywhere else is a bug.

## Typography — use the scale, never a raw size

Type drifted to 19 different sizes once, and the owner reported the result as
"hard to read / like a mess" **twice**, then reported the *retuned* scale as
"doesn't feel professional — some are too small, some are too big" a third time.
It now runs on **seven steps** (72 / 38 / 20 / 18 / 16 / 15 / 14) in the `:root`
block, each exposed as one `.t-*` utility in `globals.css` that owns family +
size + weight + leading + tracking + measure together:

| Utility | Size | Face | Used for |
|---|---|---|---|
| `.t-display` | clamp 36→72px | serif | hero name only |
| `.t-h2` | clamp 28→38px | serif | section + page titles |
| `.t-wordmark` | 20px | serif italic | nav wordmark only |
| `.t-h3` | 20px | grotesk 600 | card titles, modal title |
| `.t-h4` | 18px | grotesk 600 | component titles |
| `.t-lead-hero` | 20px | grotesk 500 | the hero intro only (borrows `--text-h3`) |
| `.t-lead` | 18px | grotesk 500 | section intro paragraphs |
| `.body-text` | 16px | grotesk 500 | all body copy |
| `.btn` / `.t-btn` | 15px | grotesk 600 | every button/link label, sentence case |
| `.t-meta` | 14px | grotesk 500 | locations, durations, captions, chips |
| `.t-data` / `.kicker` | 14px | **mono** | years, counters, index badges, short labels |

The third complaint was about the two ends of the scale, so both moved inward:
the display came down from 112px (at which the full name ran the entire width of
a desktop viewport and dwarfed everything under it) and the mono data went up
from 13px (Fragment Mono has a small x-height, and 13px tracked uppercase was
the smallest thing on the page). Buttons got their own 15px step instead of
borrowing `--text-meta`'s 14px. Sizes now differ by a step you can see.

The hero needed a second pass on top of that: the display went 84px → **72px**
and its intro paragraph 18px → **20px** (`.t-lead-hero`), because the hero was
still falling straight from the display to 18px with nothing in between, which
read as an oversized name over undersized supporting copy. `.t-lead-hero` adds a
role, not a size — it reuses `--text-h3`. The hero also dropped the
"Portfolio — 2026" register mark from the top-right corner; only the location
mark remains.

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
that nothing regressed is that the home page reports **10 visible size/face combos**
(across 7 numeric sizes; ignore the 16px/400 that `<script>` tags inherit from
`body`) and a widest prose line of **68ch**.

## Buttons and chips — `.btn`, not per-call-site padding

Every control on the site is `.btn` plus one variant (`.btn-primary` fill,
`.btn-outline` hairline), optionally `.btn-sm` for nav chrome, `.btn-icon` for
icon-only controls. Every tag/attribute pill is `.chip`. All of it lives in
`globals.css`.

This exists because the same five controls had drifted into five different
padding pairs (`px-6 py-4`, `px-5 py-3`, `px-7 py-4`, `px-6 py-3.5`, `px-4 py-2.5`)
and three different radii, and the two icon-only controls were 36px and 40px —
under the 44px target size WCAG 2.5.5 and both Apple and Material ask for.
`.btn` fixes `min-height: 2.75rem` so a control can't fall below it again.

Outlined controls use `--color-border-strong` (38% of the ink), **not**
`--color-divider` (13%). The divider token is correct for hairlines between
blocks but sits at ~1.35:1 on the ground, well under the 3:1 WCAG wants of a
control boundary — outlined buttons in it were genuinely hard to find on the
dark ground. Don't "unify" the two tokens.

Set the variant at the call site and nothing else: a `px-*`/`py-*`/`rounded-*`
next to `.btn` is the drift starting again. (`rounded-full` on the nav's Menu
button is the one deliberate exception — it's nav chrome, and the nav bar is
pinned by the owner.)

`SectionHeading` renders only the title now — it used to prefix a running `NN/07`
chapter mark, dropped because the count never matched what the reader could see
(the hero carries no heading of its own, so the last section read `06/07`) and the
sequence carried no information the section-nav rail wasn't already showing.
Don't reintroduce per-section numbering without also auditing that it stays true
against `SECTION_IDS`.

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
- **The section-edge boundary check uses a 24px tolerance (`EDGE_TOLERANCE`), not
  a few px.** A real, reported "scrolling gets stuck" bug traced to this: the
  oversized Projects section only advances once its far edge is reached, and a
  too-tight tolerance compared against `offsetTop`/`offsetHeight` (which round to
  whole device pixels) against `scrollY`/`innerHeight` (fractional under Windows'
  125%/150% display scaling) could sit permanently just out of reach. There is
  also a `setTimeout` watchdog (`WATCHDOG_BUFFER`) that force-resolves any
  in-flight animation that outlives its own duration — covers a backgrounded tab
  throttling `requestAnimationFrame` — so the `animating` flag can never get stuck
  `true` and silently swallow every wheel event after it. Don't remove either
  without reproducing the original bug first.
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
- **Expensive always-on visuals must idle — with one deliberate exception.**
  `AsciiField` gates its rAF loop on an `IntersectionObserver` and tab visibility,
  same as any always-on shader should. It does **not**, however, gate on
  `sectionscroll:start`/`sectionscroll:end` the way the old hero-only aura did: the
  cross-field morph is driven by scroll position and has to be visible during
  exactly the window a freeze-on-scroll gate would hide it in. (It no longer
  listens to those events at all — see the field-morph note below.) This means the
  shader runs continuously whenever the tab is visible, not just while one section
  is on screen — a real, accepted increase in baseline cost over the old hero-only
  aura, offset by keeping the shader itself cheap (single triangle, ~12px glyph
  cells, DPR capped at 1.75). Don't "fix" this back to a scroll-freeze without
  re-solving how the morph stays visible.
- **Case studies must stay prerendered, and their videos must stay
  click-to-play.** `app/projects/[id]/page.tsx` reads a static array, so it
  carries `generateStaticParams` and all nine ids build as `● (SSG)`. Without
  it the route builds as `ƒ` — server-rendered on demand — and every visit
  costs a function invocation plus a possible cold start for output that never
  changes. `dynamicParams` is left at its default so an unknown id still gets
  the friendly "Project not found" page instead of a bare 404.

  Every case study's media is one or two YouTube embeds, and mounting those
  iframes on page load was almost the entire reason a case study felt slow to
  open: a YouTube player is ~1MB of script plus a waterfall to youtube.com,
  googlevideo and doubleclick. `components/VideoEmbed.tsx` renders a ~20KB
  poster from `i.ytimg.com` instead and only mounts the iframe (with
  `autoplay=1`, so one click plays) when asked. Measured: `/projects/3` used to
  ship two eager players and now ships zero iframes. Don't put a bare
  `<iframe src="…youtube…">` back on a page. The `i.ytimg.com` entry in
  `next.config.js` `images.remotePatterns` exists only for that poster.
- **Whether a project offers a case study is derived from its media**, in
  `ProjectModal.tsx` — `project.media.length > 0`. It used to be a hardcoded
  `id !== 5 && id !== 6`, which didn't know about Lens Lock (id 7, `media: []`)
  and so linked to a page with a heading, a repo button and nothing under them.
  The two ids are a separate, older opt-out and are still there; they belong in
  `personalData.ts` as a field. Adding a project with no media is now safe.
- **`css.d.ts`** declares `*.css` so TS 6+ doesn't flag the `globals.css`
  side-effect import (TS2882) — Next only ships types for `*.module.css`. Keep it.
- **`components/AsciiField.tsx`** is the page's shared background: a
  dependency-free raw-WebGL (not three.js) fullscreen-triangle shader. It runs in
  **two modes**, and which one is showing is `uGlyphMix`, interpolated across a
  section change (`SECTION_GLYPH_MIX` in `components/ascii-field/theme.ts`):
  - **Hero — smooth brass smoke**, evaluated per pixel. This is the old
    standalone `HeroAura` shader, same fbm/domain-warp and the same
    `0.85 / 0.9` intensity constants, absorbed into this file. The owner has
    signed off on the smoke specifically; leave its look alone.
  - **Every other section — a live ASCII field**, the same noise/pattern maths
    quantized to a glyph ramp. One full-viewport procedural pattern per section
    (`components/ascii-field/fields.ts`): contours for about, ruled paper for
    education, rippling lanes for sports, pencil crosshatch for hobbies, a
    wireframe that assembles with scroll depth for projects, expanding signal
    rings for connect.

  The hero dissolving from smoke into type on the first scroll is that mode
  change, which is the whole reason the loop can't freeze during a section
  animation (see the idling note above).

  **The morph is driven by scroll position, not by a section-change event.**
  Every frame, `computeFieldState()` locates the viewport centre against cached
  section tops/bottoms and cross-fades the two adjacent fields over
  `BLEND_FRACTION` (0.4) of a viewport height either side of the boundary — so
  the blend covers ~80% of a section-to-section scroll and each section still
  settles on a pure field in the middle. `uTransition`, `uGlyphMix` and the
  keep-out width all interpolate off the same eased factor.

  The first version instead started a timed morph when `useActiveSection`
  changed (roughly halfway through the scroll) and then had the scroll-end event
  snap it to completion, so the field visibly **cut** rather than dissolved —
  reported as "should change smoothly, not suddenly". Don't reintroduce an
  event-triggered morph; a scroll-position blend can't desynchronise from the
  scroll. It also means the component holds no React state and never re-renders
  on a section change. Section geometry is measured only in `resize()`, so the
  per-frame path reads nothing but `window.scrollY`.

  Three things keep it from competing with the copy, and all three were tuned
  against a complaint that the background "looks bad" and must not distract:
  glyphs are drawn in `--color-field` at ~2:1 on the ground; the ramp is cut two
  characters short of its top (`%` and `@` have near-total ink coverage and read
  as solid slabs, not as characters); and an elliptical keep-out sized per
  section from `SECTION_MASK_HALF_WIDTH_PX` takes density to zero over the text
  column, so the field only ever lives in the margins.

  **There is no scene/illustration atlas.** A previous version sampled hand-drawn
  Canvas2D icon tiles (a bust, a book, a swimmer) into a small box in the right
  margin; through a coarse glyph grid they read as an unidentifiable smudge of
  dots sitting on top of the content, and were reported as such. Don't bring
  bitmap or path art back into this shader — the fields are procedural for a
  reason.

  Grid geometry comes from a fixed **CSS-pixel cell size** (`GRID_CELL_W`, and
  `GLYPH_CELL_W/H` in `atlas.ts` set its aspect), not a fixed column count: with
  a fixed count the glyphs shrank to noise on a wide monitor. The atlas cell is
  deliberately taller than wide, the proportion a character occupies in a
  terminal line box — a square cell was what made the field read as a dot grid
  rather than as text.

  **It is mounted in the root layout, so it survives client-side navigation and
  its setup effect runs once per tab.** Two consequences, both of which shipped
  as bugs: anything route-dependent has to arrive through a ref (there's a small
  `usePathname()` effect for that), and every cached measurement has to be
  invalidated on navigation. The section tops/bottoms are cached, and going
  `/` → a case study → back replaces the entire document without resizing the
  fixed canvas, so nothing else re-measured: `hasSections` latched false on the
  subpage and stayed false on the way home, leaving the hero's smoke behind
  every section. `useActiveSection` had the same shape of bug — its observer
  stayed attached to the previous render's section nodes — and now re-observes
  on `pathname` as well. If you add another cache in here, invalidate it from
  `onGeometryChange`.

  Routes with none of the scrolling sections in them get their own field from
  `ROUTE_FIELDS`: a case study borrows the Projects field, `/gallery` borrows
  Hobbies' crosshatch. Falling back to field 0 there was wrong — the smoke is
  hero-only.

  Cursor-follow drift is home-only; the Projects field's phase is keyed to scroll
  depth through the section rather than a free clock. Renders one static frame
  under `prefers-reduced-motion`, and is hidden entirely below the `md`
  breakpoint (mobile gets only the hero's CSS radial gradient, which is also the
  no-WebGL and pre-paint fallback).
- **`components/CharacterReveal.tsx`** is the reusable per-character type reveal
  (used for the hero name) — framer-motion stagger, no gsap dependency. Respects
  `prefers-reduced-motion` by rendering the plain text with no animation.
- **Project cards** (`ProjectCard` in `app/page.tsx`) grid up to `xl:grid-cols-4` —
  deliberately smaller than a 3-column layout so more of "Things I've built" is
  visible at once. Each card carries a bundle of hover cues (spring lift via
  `whileHover`, an icon rotate + accent-color swap, a CSS-only diagonal light
  sweep, a reveal arrow badge bottom-right) — none of them JS listeners, so they
  don't add to the scroll-hot-path budget above. Keep new card effects the same
  way: transform/opacity transitions driven by `group-hover`, not new global
  event listeners.
- **`components/SocialLinks.tsx`** renders `personalData.socialLinks`, which
  includes an `{ icon: "mail", url: "mailto:..." }` entry. That one entry is
  special-cased: no `target="_blank"` (a `mailto:` link opening a blank tab is a
  real bug, not a feature), and its visible label is the email address itself
  rather than the platform name, so the address is readable before a click.

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
- **Bio/education prose doesn't name specific tech stacks** (e.g. "my hands-on
  project work involves Java and Spring Boot" was removed from the SLIIT
  description). Individual project cards are where tags/stack chips belong —
  keep education and intro copy about what he's doing, not what he's coding it in.
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

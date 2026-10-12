# Personal portfolio — Lochana Dahanayake

Next.js 14 App Router + TypeScript + Tailwind, deployed on Vercel. One scrolling
page (`app/page.tsx`) with seven full-screen sections, plus `/gallery` and
`/projects/[id]` routes. All content lives in `data/personalData.ts` — no CMS.

## Swapping the theme

The current look (as of the 2026-08 redesign) is dark cinematic editorial: a
warm near-black ground, a single warm-brass accent (`#c9a24b`), a Newsreader
display serif over Geist text and Geist Mono data, hairline-bordered panels, pill
buttons, and a contour-map background (no dual accent hue). It replaced an earlier warm-cream / terracotta
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
2. **`app/layout.tsx`** — the three faces bound to `--font-heading` (Newsreader,
   `next/font/google`), `--font-body` and `--font-mono` (Geist / Geist Mono via
   `next/font/local` from the `geist` package — Next 14.2's Google list predates
   Geist). Newsreader replaced Instrument Serif (2026-10) because Instrument's
   tall, condensed hairlines thinned out on the dark ground.
3. **`tailwind.config.ts`** — only if the token *names* change. Every entry there is
   a `var(--…)` reference; keep it that way.

`components/ContourField.tsx` (the shared raw-WebGL background) is the one place
color isn't CSS: it reads `--color-bg` (the ground it paints), `--color-field`
(contour-line ink) and `--color-accent` (the cursor loupe) via `getComputedStyle`
at mount and converts them to RGB floats for the shader uniforms, so all three
retint from tokens without a hardcoded hex. There is no illustration file to
retint; sections carry themselves on type, motion, whitespace, and the map.

After a theme change, grep for a bare hex outside the `:root` block and outside the
`readRgb` conversions in `ContourField.tsx`. A literal colour anywhere else is a bug.

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
from 13px (the mono at the time, Fragment Mono, had a small x-height, and 13px
tracked uppercase was the smallest thing on the page). Buttons got their own 15px step instead of
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
  name, recognised as a shape rather than read). A display serif's thin strokes
  fall apart in light-on-dark at small sizes. Content
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

The look (2026-10, from 21st.dev's *Motion Button*) is a pill whose hover
**floods**: `.btn::before` is a `clip-path: circle()` that grows from
`--btn-origin` to cover the control on a symmetric ease, while the label inverts
to `--btn-on-fill` mid-sweep. It was first a scaled disc, which had to overshoot
the button so far that it covered it in the first fifth of the transition and
read as a snap — keep the clip circle sized to the box. `.btn-arrow` adds a
`.btn-disc` (icon in a small circle) the flood grows out of — used for the hero
CTAs. `.btn-sm` (nav chrome) opts out of the flood and keeps its quiet hover,
because the nav bar is pinned. Every variant's hover is a colour on the
pseudo-element, so per-variant hover colour rules must restate
`color: var(--btn-on-fill)`: `.btn-arrow.btn-primary` tying `.btn:hover` on
specificity once left a light label on the brass flood.

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
- **The wheel is never handed back to the browser.** Sections taller than the
  viewport used to scroll natively until their far edge, then switch to the
  section animation. On a quick scroll the browser's own smooth wheel-scroll was
  still running when the next tick started the animation, and the two fought
  over `scrollTop` — reported as the page "shaking like a small vibration". Now
  a tall section is scrolled by a short clamped glide (`INNER_GLIDE_SECONDS`) and
  only one thing ever moves the page. Sections overflowing by under
  `MIN_INNER_OVERFLOW` (80px) count as fitting: on the owner's 732px-tall
  laptop screen Education and Hobbies run ~30px over, which is what first
  triggered the native hand-off. Tiny deltas (`< 4`) are still claimed but can
  only nudge a glide, never change section.
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
  `ContourField` gates its rAF loop (and its pointer listener) on an
  `IntersectionObserver` and tab visibility. It does **not** freeze during
  SmoothSectionScroll's animation: the scroll pan has to be visible during
  exactly that window. So the shader runs whenever the tab is visible — an
  accepted baseline cost, offset by keeping it cheap (single triangle, 3-octave
  noise, DPR capped at 1.75). Don't "fix" this back to a scroll-freeze.
- **Case studies must stay prerendered, and their videos must stay
  click-to-play.** `app/projects/[id]/page.tsx` reads a static array, so it
  carries `generateStaticParams` and all nine ids build as `● (SSG)`. Without
  it the route builds as `ƒ` — server-rendered on demand — and every visit
  costs a function invocation plus a possible cold start for output that never
  changes. `dynamicParams` is left at its default so an unknown id still gets
  the friendly "Project not found" page instead of a bare 404.

  Every case study's media is one or two YouTube videos, played through
  **Video.js 10** (`@videojs/react` + `@videojs/youtube-video`) in
  `components/VideoEmbed.tsx`, not a bare YouTube iframe — YouTube's own UI
  showed recommended videos (on hover, on pause, on the end screen), which the
  owner didn't want. Self-hosting on Mux (the Vercel Marketplace video option)
  was offered and declined; the videos stay on YouTube. Four things keep it
  clean, all load-bearing:

  - **Click-to-play.** A YouTube player is ~1MB of script plus a waterfall to
    youtube.com/googlevideo; mounting them on page load was almost the entire
    reason a case study felt slow. A ~20KB `i.ytimg.com` poster renders until
    the visitor clicks (that host is the only reason it's in
    `next.config.js` `images.remotePatterns`). Don't put a bare
    `<iframe src="…youtube…">` back on a page.
  - **The iframe is inert** (`.case-study-player iframe { pointer-events: none }`
    in `globals.css`). With the pointer reaching it, YouTube raised its title
    bar and "More videos" panel and swallowed the hover the skin needs to show
    its controls.
  - **`onEnded` drops back to the poster**, before YouTube's end-screen grid of
    suggestions can appear.
  - **The skin CSS is served by `app/vendor/videojs-skin.css/route.ts`**, built
    once at `next build` from the installed package with its `@layer` wrappers
    removed. It can't be imported: it's written for Tailwind v4's native layers,
    and Tailwind v3 crashes on its bare `@layer utilities;` and would purge its
    `components` layer if inlined. Linked as-is, unlayered Tailwind preflight
    would beat every layered skin rule. Linked from `VideoEmbed`, so only
    pages with a video load it.

  Controls: play, scrub, ±10s buttons (`.case-study-seek` — the default skin
  has no control-bar slot, so they flank the centre and fade with the bar via
  `data-controls-visible`), speed in the settings menu, volume, fullscreen.
  There is **no quality selector**: YouTube's iframe API no longer lets a page
  pick quality (that would need self-hosting, Mux/HLS). Instead the iframe is
  laid out at **200% and scaled to 50%** in `globals.css`: YouTube picks the
  stream from the player's layout size, and at its natural ~900px it settled on
  480p/720p, which the owner reported. Measured after the change: the embed
  steps up to hd1080, the top level that video offers. Don't remove it as an
  odd-looking transform. Vidstack was the
  first choice and is deprecated in favour of Video.js 10 — don't reintroduce it.
- **Whether a project offers a case study is derived from its media**, in
  `ProjectModal.tsx` — `project.media.length > 0`. It used to be a hardcoded
  `id !== 5 && id !== 6`, which didn't know about Lens Lock (id 7, `media: []`)
  and so linked to a page with a heading, a repo button and nothing under them.
  The two ids are a separate, older opt-out and are still there; they belong in
  `personalData.ts` as a field. Adding a project with no media is now safe.
- **`css.d.ts`** declares `*.css` so TS 6+ doesn't flag the `globals.css`
  side-effect import (TS2882) — Next only ships types for `*.module.css`. Keep it.
- **`components/ContourField.tsx`** is the page's shared background (2026-10,
  replacing an ASCII glyph field): one continuous topographic map drawn by a
  raw-WebGL2 fullscreen-triangle shader (`components/contour-field/shader.ts`,
  tuning in `contour-field/theme.ts`), with animated film grain and a soft
  vignette. Picked by the owner from three prototypes (contour map, ink wash,
  light through fluted glass), referenced from 21st.dev's *Topo Field* and
  *Luminous Topography*.

  **Scrolling pans across the map** — `uScroll` is `scrollY / viewportHeight`
  times `SCROLL_PARALLAX`, a pure function of scroll position, so a section
  change is a camera move over the same terrain and can never cut or fall out of
  step. The owner's original ask was "smooth transition between the sections";
  this is the answer, so keep the morph position-driven, never event-driven.

  **The cursor is a loupe, on every section:** lines under it turn brass, thicken
  and the terrain swells outward (`CURSOR_RADIUS`). Two owner calls bracket it:
  the first build was too subtle ("people won't notice"), the next too abrupt
  ("suddenly applying and removing the effect"). So it stays visible but eases:
  position and fade are time-based exponential smoothing
  (`CURSOR_FOLLOW_SECONDS`, `CURSOR_FADE_SECONDS`), and the brass ramps in on a
  smoothstep. Touch `pointermove` is ignored (a touch drag is a scroll gesture).

  **Three octaves of noise, not five.** Five read as a map of noisy islands.
  **Grain uses an integer hash** — a float `sin`/`fract` hash showed a visible
  lattice at this amplitude; the integer ops are why this is WebGL2 / GLSL ES 3.00
  (also needed for `fwidth`). No WebGL2 → nothing paints and the body ground shows.

  **Text keep-out.** An ellipse over each section's copy takes the lines down to
  `SECTION_MASK_FLOOR` — ~6% where copy sits straight on the ground (hero,
  about, connect), 70% in the carded sections, whose `.card-glass` panels are
  74% opaque so the map shows faintly through them (owner's ask). The cursor's
  extra brightness stays suppressed inside the ellipse either way; centre and both radii interpolate across
  a section boundary (`BLEND_FRACTION`). Section half-widths come from
  `SECTION_MASK_HALF_WIDTH_PX`; the hero measures its own, because its copy is a
  left block. Two traps in `measureHeroMask`:

  - **Measure the per-character leaf spans, not the `<h1>`.** Each
    `CharacterReveal` line is a stretched flex item at the container's full
    width though the name draws about half of it.
  - **Use `offsetLeft`/`offsetTop`, never `getBoundingClientRect`.** The reveal
    animates characters as a *transform*, which rects include; a rect taken at
    mount reads the copy ~75px low for the whole entrance.

  **Layering: the canvas is opaque and sits at `-z-10`.** It paints the ground
  itself, so at `z-0` it covered every non-positioned element — a case study's
  title and description vanished, only the (positioned) buttons showed. For the
  same reason no `<main>` carries `bg-bg`: the body paints the ground, which is
  what shows below `md` (canvas hidden; the hero's CSS radial gradient is the
  mobile ground) and without WebGL2.

  **Mounted in the root layout, so its setup effect runs once per tab.**
  Route-dependent values arrive through a ref (the `usePathname()` effect), and
  every cached measurement is invalidated on navigation via `onGeometryChange` —
  section tops are cached, and `/` → case study → back replaces the document
  without resizing the fixed canvas. If you add a cache, invalidate it there.
  `resize()` may skip reassigning `canvas.width` when unchanged, but must
  re-send `uResolution`/`uPixelRatio` every time: uniforms are per-program
  state, and StrictMode / Fast Refresh re-run the effect against the same
  canvas — guarding them once left the field rendering nothing.

  Renders one static frame (no grain motion) under `prefers-reduced-motion`.
  Measured: steady 144fps (~7ms frames) on the owner's machine.
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

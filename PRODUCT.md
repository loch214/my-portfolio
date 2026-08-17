# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Next.js 14 (App Router) + TypeScript + Tailwind CSS 3, deployed on Vercel. `framer-motion`, `react-icons`, `lucide-react`, `react-intersection-observer` already installed. [Inferred from package.json — not asked, since the stack question only applies to greenfield projects.]

## Users

Primary: people evaluating Lochana professionally after finding the link elsewhere — recruiters, hiring managers, professors, potential collaborators — skimming to judge whether he can build real things and communicate clearly about them. Secondary: Lochana himself, using it as a running record of what he's built. [Inferred from CLAUDE.md's copy-tone constraint — "plain, natural, understated... must not read as boastful" — which only makes sense against a professional-evaluation audience. Not directly confirmed by the user.]

## Product Purpose

A single-page developer portfolio that establishes credibility fast: who he is, what he's built, and how to reach him. Success is a visitor forming an accurate, positive impression of his engineering work within the scroll of one page, then following through to a project repo, the resume, or a contact channel.

## Positioning

Not a design portfolio, not a resume PDF, not a template-derived personal site. The differentiator the redesign is chasing: a page that *feels* built with the same craft attention as the software it describes — motion and typography doing real communicative work, not decoration — while staying honest about the fact that he's a student with real, sometimes unglamorous project outcomes (a 65%-accuracy classifier, a car-detection model that "isn't accurate enough for production") rather than a polished-startup narrative.

## Operating Context

- One scrolling page (`app/page.tsx`) built from seven full-screen sections (Hero, About, Education, Sports/Art/Clubs-style personal facets, Projects, Contact — exact ids fixed in `hooks/useActiveSection.ts`), plus a `/gallery` route and `/projects/[id]` detail routes.
- All content is static, sourced from `data/personalData.ts` — no CMS, no backend.
- Custom scroll system (`SmoothSectionScroll.tsx`): eased rAF section-to-section scroll on desktop/non-reduced-motion, falling back to native CSS scroll-snap on touch and `prefers-reduced-motion`.
- Real evidence per project is uneven: some projects have full YouTube walkthrough embeds, some have a screenshot or two, some (`Lens Lock`) have no media at all yet.

## Capabilities and Constraints

- **Restyle, don't rewrite logic.** This redesign changes tokens, typography, motion treatment, and visual language — not section structure, scroll mechanics, routing, or data shape, unless the user explicitly asks for a structural change.
- The blurred translucent nav bar stays as-is (standing constraint from the owner, CLAUDE.md).
- The Projects section is allowed to exceed one viewport; every other section should fit a 900px-tall viewport (standing constraint).
- Copy tone: plain, natural, understated, not AI-generated-sounding, not boastful. He is a software engineering student who builds things for fun and explores AI/cybersecurity on the side — not a musician, and the "my degree is software engineering" framing should not be leaned on.
- Theme is fully tokenised by design: `app/globals.css` (`:root` tokens + shared utility classes `.card`, `.kicker`, `.body-text`, `.washed`, `.elev-*`, `.snap-section`, `.anim-float*`), `app/layout.tsx` (the two `next/font/google` faces bound to `--font-heading`/`--font-body`), and `tailwind.config.ts` (only if token *names* change). `components/illustrations/index.tsx` (seven SVG scenes) retints automatically via `var(--color-*)` fills. A bare hex outside the `:root` block is a bug.
- No CMS/backend — any new visual system must be deliverable as static tokens/components, not data-driven theming.

## Brand Commitments

Name: Lochana Kavindu Dahanayake. No existing logo/wordmark system beyond typography. The previous visual system ("Organic": warm cream/terracotta/sage, from a since-deleted Claude design handoff) is explicitly being discarded, not preserved — this is a full redesign/rebrand of the visual world, not a refinement. A few in-code comments still reference "Organic"; they're safe to rewrite.

## Evidence on Hand

- `data/personalData.ts`: real bio, education history, sports/art/club history, 9 real projects with real GitHub links and real YouTube demo embeds (a few projects have screenshots at `/public/projects/*`, `Lens Lock` has none).
- `/public/art/*`: three real art pieces (pencil sketch, digital abstract, pastel landscape) used in the gallery.
- No testimonials, press, or third-party proof exist and none should be fabricated.
- Real social links: GitHub, LinkedIn, Instagram.

## Product Principles

1. Craft is the pitch. The site's own execution (motion, type, restraint) is itself evidence of engineering/design ability — it should never feel like a template with a color swap.
2. Honesty over polish theater. Real, sometimes-modest project outcomes stay stated plainly; the redesign should make them feel considered, not spin them into hype.
3. Every section still earns its own screen. The one-viewport-per-section discipline (Projects excepted) stays; the new visual world must work within that constraint, not fight it.
4. Motion communicates, it doesn't decorate. Any new animation (reveals, transitions, hover states) should clarify hierarchy or reward attention, matching the "used with intent" bar already set by `SmoothSectionScroll`.
5. Everything retints from tokens. No visual decision should be hardcoded outside `globals.css`/`layout.tsx`/`tailwind.config.ts`, so the system stays swappable the way CLAUDE.md documents.

## Accessibility & Inclusion

`prefers-reduced-motion` must continue to be honored (existing `SmoothSectionScroll` bailout and CSS fallback) under any new motion system. No other accessibility requirement has been confirmed beyond what the current implementation already does. [Not separately asked; carried forward from existing code behavior per CLAUDE.md.]

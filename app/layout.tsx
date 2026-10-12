import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";
import MotionProvider from "@/components/MotionProvider";
import SectionNav from "@/components/SectionNav";
import SmoothSectionScroll from "@/components/SmoothSectionScroll";
import ContourField from "@/components/ContourField";
import "./globals.css";

/* Newsreader replaced Instrument Serif for the display and section titles.
   Instrument Serif is a tall, condensed, very high-contrast face whose hairlines
   thin out on a dark ground; Newsreader is an optical-size serif (opsz 6-72)
   that stays sturdier and wider at the same size. Variable, so the opsz axis
   tracks font-size on its own. */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-heading",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  // Next 14.2 ships no fallback metrics for Newsreader and logs an error
  // trying to compute them; name the fallback outright instead.
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

/* Geist (Vercel's screen face) for body, buttons and data. Loaded from the
   `geist` package's own variable woff2 rather than next/font/google, because
   Next 14.2's Google font list predates Geist. Bound to the same token names
   the rest of the CSS already uses. */
const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lochana Dahanayake",
  description: "Software engineering student exploring practical solutions, one project at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {/*
          THESIS: A developer's proof-of-work staged like a screening room, not a SaaS template —
          restraint and one authored motion moment carry the credibility a badge grid would only claim.
          OWN-WORLD: warm near-black ground, single warm-brass accent, Newsreader display over
          Geist text and Geist Mono data, hairline dividers, no cards-of-icons.
          STORY: a recruiter/collaborator lands, reads who he is and what he's shipped in one scroll,
          leaves knowing whether to open a repo, the resume, or a contact link.
          FIRST VIEWPORT: full-bleed hero, per-character name reveal over one continuous contour
          map whose lines warm to brass under the pointer; scrolling travels across the same map,
          so there is never a cut between sections — see components/ContourField.tsx.
          FORM: dark cinematic editorial — brief-pinned by the user (not rolled); seed key: brief-pinned.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
          the verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        <ContourField />
        <MotionProvider>
          <SmoothSectionScroll />
          <SectionNav />
          <Navigation />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

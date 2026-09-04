import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, Fragment_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import MotionProvider from "@/components/MotionProvider";
import SectionNav from "@/components/SectionNav";
import SmoothSectionScroll from "@/components/SmoothSectionScroll";
import AsciiField from "@/components/AsciiField";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
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
      className={`${instrumentSerif.variable} ${hankenGrotesk.variable} ${fragmentMono.variable}`}
    >
      <body>
        {/*
          THESIS: A developer's proof-of-work staged like a screening room, not a SaaS template —
          restraint and one authored motion moment carry the credibility a badge grid would only claim.
          OWN-WORLD: near-black ground (#0a0a09), single warm-brass accent (#c9a24b), oversized
          Instrument Serif display over small tracked Fragment Mono labels, hairline dividers, no cards-of-icons.
          STORY: a recruiter/collaborator lands, reads who he is and what he's shipped in one scroll,
          leaves knowing whether to open a repo, the resume, or a contact link.
          FIRST VIEWPORT: full-bleed hero, WebGL brass smoke tracking the pointer behind an
          oversized per-character name reveal, one mono line of role, two rectangular CTAs bottom-left.
          That smoke resolves into a live ASCII glyph field on the first scroll, one procedural
          pattern per section below — see components/AsciiField.tsx.
          FORM: dark cinematic editorial — brief-pinned by the user (not rolled); seed key: brief-pinned.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
          the verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        <AsciiField />
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

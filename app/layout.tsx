import type { Metadata } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import Navigation from "@/components/Navigation";
import MotionProvider from "@/components/MotionProvider";
import SectionNav from "@/components/SectionNav";
import "./globals.css";

const caprasimo = Caprasimo({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
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
    <html lang="en" className={`${caprasimo.variable} ${figtree.variable}`}>
      <body>
        <MotionProvider>
          <SectionNav />
          <Navigation />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

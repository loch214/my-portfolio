import type { Metadata } from "next";
import { Lora, IBM_Plex_Mono, Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import MotionProvider from "@/components/MotionProvider";
import SectionNav from "@/components/SectionNav";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
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
    <html lang="en" className={`${lora.variable} ${plexMono.variable} ${inter.variable}`}>
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

import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description: "Modern personal website showcasing skills, education, and interests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>
          <Navigation />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}


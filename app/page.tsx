'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import SocialLinks from '@/components/SocialLinks';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';
import { personalData } from '@/data/personalData';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a]">
      <Navigation />
      <Hero data={personalData} />
      <AboutMe data={personalData} />
      <ScrollRevealSection data={personalData} />
      <ClubsAndSocieties data={personalData} />
      <SocialLinks links={personalData.socialLinks} />
    </main>
  );
}


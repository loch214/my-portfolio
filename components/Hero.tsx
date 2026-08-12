'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { PersonalData } from '@/data/personalData';

interface HeroProps {
  data: PersonalData;
}

export default function Hero({ data }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const fadeIn = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }
        };

  return (
    <section id="home" className="snap-section min-h-screen flex items-center relative overflow-hidden pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div {...fadeIn(0)} className="flex items-center gap-3 mb-8">
          <span className="h-px w-8 bg-accent" />
          <span className="eyebrow">Student · Developer · Tinkerer</span>
        </motion.div>

        <motion.h2
          {...fadeIn(0.08)}
          className="font-display text-xl sm:text-2xl text-ink-soft mb-3"
        >
          {data.name}
        </motion.h2>

        <motion.h1
          {...fadeIn(0.16)}
          className="font-display italic text-4xl sm:text-5xl md:text-6xl leading-[1.15] text-ink mb-8 max-w-3xl text-balance"
        >
          Learning. Building. Improving.
        </motion.h1>

        <motion.p
          {...fadeIn(0.3)}
          className="body-text text-lg md:text-xl max-w-xl mb-10"
        >
          {data.bio}
        </motion.p>

        <motion.div {...fadeIn(0.42)}>
          <a
            href="#about"
            className="group inline-flex items-center gap-3 border border-line px-6 py-3 font-mono text-sm text-ink transition hover:border-accent hover:text-accent"
          >
            scroll to read more
            <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex"
        aria-hidden="true"
      >
        <span className="h-px w-40 bg-line" />
        <span className="h-px w-28 bg-line" />
        <span className="h-px w-52 bg-line" />
        <span className="h-px w-16 bg-accent/60" />
        <span className="h-px w-36 bg-line" />
      </div>
    </section>
  );
}

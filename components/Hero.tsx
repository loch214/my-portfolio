'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { PersonalData } from '@/data/personalData';
import { HeroScene } from '@/components/illustrations';

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
    <section
      id="home"
      className="snap-section min-h-screen flex items-center relative overflow-hidden pt-28 pb-16"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.div {...fadeIn(0)} className="mb-6 flex items-center gap-3">
              <span className="h-1.5 w-10 rounded-full bg-accent" />
              <span className="kicker">Student · Developer · Tinkerer</span>
            </motion.div>

            <motion.p
              {...fadeIn(0.08)}
              className="mb-3 font-heading text-lg text-ink-soft sm:text-xl"
            >
              {data.name}
            </motion.p>

            <motion.h1
              {...fadeIn(0.16)}
              className="mb-6 font-heading text-[2.5rem] leading-[1.1] text-ink sm:text-5xl lg:text-[3.5rem]"
            >
              Learning.<br />Building.<br />
              <span className="text-accent-700">Improving.</span>
            </motion.h1>

            <motion.p
              {...fadeIn(0.3)}
              className="body-text mb-8 max-w-lg text-[17px]"
            >
              {data.bio}
            </motion.p>

            <motion.div {...fadeIn(0.42)} className="flex flex-wrap items-center gap-3">
              <a
                href="#about"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-heading text-sm text-bg transition-colors hover:bg-accent-600 active:bg-accent-700"
              >
                Explore the work
                <ArrowDown size={17} strokeWidth={2.75} className="transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#connect"
                className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-heading text-sm text-ink transition-colors hover:bg-neutral-300/50"
              >
                Get in touch
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-sage-300/60 blur-[2px]"
              aria-hidden="true"
            />
            <HeroScene className="anim-float-slow relative w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

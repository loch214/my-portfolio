'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { PersonalData } from '@/data/personalData';
import HeroAura from '@/components/HeroAura';
import CharacterReveal from '@/components/CharacterReveal';

interface HeroProps {
  data: PersonalData;
}

const traits = ['Student', 'Developer', 'Tinkerer'];

export default function Hero({ data }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const fadeIn = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        };

  return (
    <section
      id="home"
      className="snap-section relative flex min-h-screen items-center overflow-hidden pb-16 pt-28"
    >
      {/* Signature moment: procedural WebGL aura behind the name. A static
          radial gradient underneath covers both the load flash before the
          canvas paints and the no-WebGL / reduced-motion fallback. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)',
        }}
      />
      <HeroAura className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Frame register marks — corner chrome, not a caption for the name below. */}
      <div className="absolute inset-x-6 top-24 z-10 flex items-center justify-between sm:inset-x-8 lg:inset-x-10">
        <span className="kicker">Colombo, Sri Lanka</span>
        <span className="kicker kicker-muted hidden sm:inline">Portfolio — 2026</span>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <h1 className="font-heading text-[15vw] leading-[0.92] tracking-[-0.03em] text-neutral-100 sm:text-[11vw] lg:text-[7.4rem]">
          <CharacterReveal text={data.name.split(' ')[0]} as="div" delay={0.1} />
          <CharacterReveal
            text={data.name.split(' ').slice(1).join(' ')}
            as="div"
            delay={0.32}
            className="italic text-accent"
          />
        </h1>

        <motion.div {...fadeIn(0.7)} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {traits.map((trait, i) => (
            <span key={trait} className="flex items-center gap-3">
              <span className="kicker">{trait}</span>
              {i < traits.length - 1 && <span className="h-1 w-1 rounded-full bg-neutral-600" />}
            </span>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.p {...fadeIn(0.82)} className="body-text max-w-lg text-[17px]">
            {data.bio}
          </motion.p>

          <motion.div {...fadeIn(0.94)} className="flex flex-wrap items-center gap-3 lg:justify-end">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2.5 rounded-md bg-accent px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent-400"
            >
              See the work
              <ArrowDown size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#connect"
              className="group inline-flex items-center gap-2.5 rounded-md border border-line px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.08em] text-neutral-100 transition-colors hover:border-accent hover:text-accent"
            >
              Get in touch
              <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

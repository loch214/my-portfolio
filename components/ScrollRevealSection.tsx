'use client';

import { motion } from 'framer-motion';
import { FileText, ExternalLink, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { PersonalData } from '@/data/personalData';
import SectionHeading from '@/components/SectionHeading';

interface ScrollRevealSectionProps {
  data: PersonalData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const viewport = { once: true, amount: 0.25 } as const;

export default function ScrollRevealSection({ data }: ScrollRevealSectionProps) {
  return (
    <>
      {/* Education */}
      <section
        id="education"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading index="02" total="07" title="Where I've studied" />

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <motion.article
                key={index}
                className="card p-6 sm:p-7"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-heading text-2xl text-neutral-100 sm:text-[1.75rem]">{edu.school}</h3>
                  <span className="font-mono text-[13px] text-accent">{edu.period}</span>
                </div>
                <p className="mt-1.5 text-base font-semibold text-neutral-200">{edu.degree}</p>
                {(edu.stream || edu.location) && (
                  <p className="mt-0.5 font-mono text-[13px] text-neutral-400">
                    {[edu.stream, edu.location].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="body-text mt-3 max-w-3xl text-[15px]">{edu.description}</p>
                {edu.resultsPdf && (
                  <a
                    href={edu.resultsPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-4 inline-flex items-center gap-2 rounded-md border border-line px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.06em] text-neutral-100 transition-colors hover:border-accent hover:text-accent"
                  >
                    <FileText size={15} strokeWidth={2.5} />
                    Academic results
                    <ExternalLink
                      size={13}
                      strokeWidth={2.5}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section
        id="sports"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading index="03" total="07" title="On the field" />

          <div className="grid gap-4 sm:grid-cols-2">
            {data.sports.map((sport, index) => (
              <motion.article
                key={index}
                className="card p-6 sm:p-7"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <span className="font-mono text-[13px] text-accent">{sport.years ?? sport.duration}</span>
                <h3 className="mt-2 font-heading text-2xl text-neutral-100">{sport.name}</h3>
                <p className="mt-0.5 font-mono text-[12px] text-neutral-400">{sport.duration} of training</p>
                <p className="body-text mt-3 text-[15px]">{sport.achievements}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies */}
      <section
        id="hobbies"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading index="04" total="07" title="Away from the screen" />

          <motion.p
            className="body-text mb-6 max-w-2xl text-[17px]"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Outside of coursework I draw, build small things for the fun of it, and keep
            wandering into parts of tech that have nothing to do with my degree.
          </motion.p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Building for fun',
                value:
                  'Most of my free time goes into building small tools of my own. Some turn out genuinely useful, others are just silly ideas I wanted to see working. I usually start coding without much of a plan and work the rest out as I go.',
              },
              {
                label: 'Exploring tech',
                value:
                  'Software engineering is my main focus, but I make time for other areas as well. Recently that has meant small AI and cyber security projects, built to understand how they work rather than to specialise in them.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="card p-5 sm:p-6"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.08 }}
              >
                <p className="kicker mb-2">{item.label}</p>
                <p className="body-text text-[15px]">{item.value}</p>
              </motion.div>
            ))}

            <motion.div
              className="card p-5 sm:col-span-2 sm:p-6"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              <p className="kicker mb-2">Art</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {data.art.mediums.map((medium) => (
                  <span
                    key={medium}
                    className="rounded-sm border border-line px-2.5 py-1 font-mono text-[12px] text-neutral-300"
                  >
                    {medium}
                  </span>
                ))}
              </div>
              <p className="body-text text-[15px]">{data.art.achievements}</p>
              <Link
                href="/gallery"
                className="group mt-4 inline-flex items-center gap-1.5 rounded-md border border-line px-4 py-2 font-mono text-[12px] uppercase tracking-[0.06em] text-neutral-100 transition-colors hover:border-accent hover:text-accent"
              >
                See the gallery
                <ArrowUpRight
                  size={14}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

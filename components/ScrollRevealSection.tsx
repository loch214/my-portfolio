'use client';

import { motion } from 'framer-motion';
import { FileText, ExternalLink, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { PersonalData } from '@/data/personalData';
import SectionHeading from '@/components/SectionHeading';
import { EducationScene, SportsScene, HobbiesScene } from '@/components/illustrations';

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
          <SectionHeading index="02" kicker="Education" title="Where I've studied" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <motion.article
                  key={index}
                  className="card elev-sm p-6 transition-shadow hover:shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <span className="inline-flex rounded-full bg-accent-200 px-3 py-1 text-[13px] font-bold text-accent-800">
                    {edu.period}
                  </span>
                  <h3 className="mt-2.5 font-heading text-xl text-ink">{edu.school}</h3>
                  <p className="mt-1 text-base font-semibold text-ink">{edu.degree}</p>
                  {(edu.stream || edu.location) && (
                    <p className="mt-0.5 text-[15px] text-ink-soft">
                      {[edu.stream, edu.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="body-text mt-2.5 text-[15px]">{edu.description}</p>
                  {edu.resultsPdf && (
                    <a
                      href={edu.resultsPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-3.5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-bg transition-colors hover:bg-accent-600 active:bg-accent-700"
                    >
                      <FileText size={16} strokeWidth={2.75} />
                      Academic results
                      <ExternalLink
                        size={14}
                        strokeWidth={2.75}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                </motion.article>
              ))}
            </div>

            <motion.div
              className="mx-auto w-full max-w-[240px] lg:max-w-[300px] lg:justify-self-end"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <EducationScene className="anim-float w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sports */}
      <section
        id="sports"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading index="03" kicker="Sports" title="On the field" tone="sage" />

          <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <motion.div
              className="order-2 mx-auto w-full max-w-[240px] lg:order-1 lg:max-w-[300px]"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SportsScene className="anim-float w-full" />
            </motion.div>

            <div className="order-1 grid gap-4 sm:grid-cols-2 lg:order-2">
              {data.sports.map((sport, index) => (
                <motion.article
                  key={index}
                  className="card elev-sm p-6 transition-shadow hover:shadow-md"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <span className="inline-flex rounded-full bg-sage-200 px-3 py-1 text-[13px] font-bold text-sage-800">
                    {sport.years ?? sport.duration}
                  </span>
                  <h3 className="mt-2.5 font-heading text-xl text-ink">{sport.name}</h3>
                  <p className="mt-0.5 text-[15px] text-ink-soft">{sport.duration} of training</p>
                  <p className="body-text mt-2.5 text-[15px]">{sport.achievements}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hobbies */}
      <section
        id="hobbies"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading index="04" kicker="Hobbies" title="Away from the screen" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
            <div>
              <motion.p
                className="body-text mb-5 max-w-xl text-[17px]"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                transition={{ duration: 0.6 }}
              >
                Outside of coursework I draw, build small things for the fun of it, and keep
                wandering into parts of tech that have nothing to do with my degree.
              </motion.p>

              <div className="grid gap-3 sm:grid-cols-2">
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
                    className="card p-5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={fadeUp}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                  >
                    <p className="kicker mb-1.5">{item.label}</p>
                    <p className="body-text text-[15px]">{item.value}</p>
                  </motion.div>
                ))}

                <motion.div
                  className="card p-5 sm:col-span-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: 0.16 }}
                >
                  <p className="kicker kicker-sage mb-1.5">Art</p>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {data.art.mediums.map((medium) => (
                      <span
                        key={medium}
                        className="rounded-full bg-sage-200 px-3 py-1 text-[13px] font-semibold text-sage-800"
                      >
                        {medium}
                      </span>
                    ))}
                  </div>
                  <p className="body-text text-[15px]">{data.art.achievements}</p>
                  <Link
                    href="/gallery"
                    className="group mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:bg-neutral-300/50"
                  >
                    See the gallery
                    <ArrowUpRight
                      size={15}
                      strokeWidth={2.75}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mx-auto w-full max-w-[240px] lg:max-w-[300px] lg:justify-self-end"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <HobbiesScene className="anim-float w-full" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

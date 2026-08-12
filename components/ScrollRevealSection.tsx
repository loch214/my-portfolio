'use client';

import { motion } from 'framer-motion';
import { FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PersonalData } from '@/data/personalData';

interface ScrollRevealSectionProps {
  data: PersonalData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function ScrollRevealSection({ data }: ScrollRevealSectionProps) {
  return (
    <>
      {/* Education Section */}
      <section id="education" className="snap-section min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <span className="font-mono text-xs text-muted">02</span>
            <span className="eyebrow">Education</span>
            <span className="hairline flex-1" />
          </div>

          <div className="relative pl-10">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
            <div className="space-y-14">
              {data.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <span className="rail-node absolute -left-10 top-1.5 h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
                  <p className="font-mono text-xs text-accent mb-2">{edu.period}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-ink mb-1">
                    {edu.school}
                  </h3>
                  <p className="text-ink-soft text-lg mb-3">
                    {edu.degree}
                  </p>
                  {(edu.stream || edu.location) && (
                    <p className="text-sm text-muted mb-3">
                      {[edu.stream, edu.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <p className="body-text mb-4">
                    {edu.description}
                  </p>
                  {edu.resultsPdf && (
                    <a
                      href={edu.resultsPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-ink transition-colors group"
                    >
                      <FileText size={16} />
                      <span>Academic results</span>
                      <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="snap-section min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <span className="font-mono text-xs text-muted">03</span>
            <span className="eyebrow">Sports</span>
            <span className="hairline flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.sports.map((sport, index) => (
              <motion.div
                key={index}
                className="card p-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="font-mono text-xs text-accent mb-3">
                  {sport.years ?? sport.duration}
                </p>
                <h3 className="font-display text-2xl text-ink mb-1">
                  {sport.name}
                </h3>
                <p className="text-sm text-muted mb-4">{sport.duration} of training</p>
                <p className="body-text">
                  {sport.achievements}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="snap-section min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-12">
            <span className="font-mono text-xs text-muted">04</span>
            <span className="eyebrow">Hobbies</span>
            <span className="hairline flex-1" />
          </div>

          <div className="divide-y divide-line border-t border-b border-line mb-12">
            <motion.div
              className="py-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <p className="body-text">
                Music runs in the background of most things I do &mdash; coding, studying, cooking. It is not for everyone, but for me it is what keeps my focus steady.
              </p>
            </motion.div>

            <motion.div
              className="py-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <p className="eyebrow mb-2">Instruments</p>
              <p className="body-text">
                {data.music.instruments.join(', ')}
              </p>
            </motion.div>

            <motion.div
              className="py-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="eyebrow mb-2">Vocals</p>
              <p className="body-text">{data.music.singing}</p>
            </motion.div>

            <motion.div
              className="py-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="eyebrow mb-2">On repeat</p>
              <p className="body-text">{data.music.listening}</p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="eyebrow mb-3">Art</p>
            <div className="flex flex-wrap gap-3 mb-5">
              {data.art.mediums.map((medium, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 border border-line bg-surface text-sm text-ink-soft font-mono"
                >
                  {medium}
                </span>
              ))}
            </div>
            <p className="body-text">{data.art.achievements}</p>
            <div className="mt-6">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 font-mono text-sm text-accent hover:text-ink transition-colors group"
              >
                <FileText size={16} />
                <span>See the gallery</span>
                <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PersonalData, projectsData } from '@/data/personalData';
import SectionHeading from '@/components/SectionHeading';
import { AboutScene } from '@/components/illustrations';

interface AboutMeProps {
  data: PersonalData;
}

const technologies = Array.from(
  new Set(projectsData.flatMap((project) => project.tags))
).sort((a, b) => a.localeCompare(b));

export default function AboutMe({ data }: AboutMeProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      id="about"
      className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-5xl" ref={ref}>
        <SectionHeading index="01" kicker="About" title="A bit about me" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <motion.p
              className="body-text mb-7 max-w-xl text-[17px]"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {data.introduction}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="kicker mb-3">Working with</p>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, index) => (
                  <span
                    key={tech}
                    className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
                      index % 3 === 0
                        ? 'bg-accent-100 text-accent-800'
                        : index % 3 === 1
                          ? 'bg-sage-100 text-sage-800'
                          : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mx-auto w-full max-w-[260px] lg:max-w-[320px] lg:justify-self-end"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AboutScene className="anim-float w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

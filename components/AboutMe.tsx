'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PersonalData, projectsData } from '@/data/personalData';
import SectionHeading from '@/components/SectionHeading';

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
        <SectionHeading title="A bit about me" />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <motion.p
            className="t-lead"
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
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="chip"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

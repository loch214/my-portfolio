'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PersonalData, projectsData } from '@/data/personalData';

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
    <section id="about" className="snap-section min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto w-full" ref={ref}>
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-muted">01</span>
          <span className="eyebrow">About</span>
          <span className="hairline flex-1" />
        </motion.div>

        <motion.p
          className="font-display italic text-xl md:text-2xl text-ink leading-relaxed mb-14"
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
          <p className="eyebrow mb-4">Working with</p>
          <div className="flex flex-wrap gap-2.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="border border-line bg-surface px-3.5 py-1.5 font-mono text-sm text-ink-soft"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

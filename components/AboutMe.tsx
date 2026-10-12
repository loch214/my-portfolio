'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PersonalData } from '@/data/personalData';
import SectionHeading from '@/components/SectionHeading';

interface AboutMeProps {
  data: PersonalData;
}

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

        {/* A "Working with" chip list used to sit beside this, built from every
            project's tags. It surfaced tools the owner hasn't actually used and
            was removed at his request; a hand-written list of his real skills
            is planned to replace it. Don't regenerate it from project tags. */}
        <motion.p
          className="t-lead"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {data.introduction}
        </motion.p>
      </div>
    </section>
  );
}

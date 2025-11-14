'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User } from 'lucide-react';
import { PersonalData } from '@/data/personalData';

interface AboutMeProps {
  data: PersonalData;
}

export default function AboutMe({ data }: AboutMeProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative snap-start">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <User className="text-purple-400" size={40} />
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              About Me
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="glass rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed text-center font-light tracking-wide">
            {data.introduction}
          </p>
        </motion.div>
      </div>
    </section>
  );
}


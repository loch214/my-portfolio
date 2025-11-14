'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { School, Calendar } from 'lucide-react';

interface EducationItem {
  school: string;
  degree: string;
  period: string;
  description?: string;
}

interface EducationProps {
  education: EducationItem[];
}

export default function Education({ education }: EducationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent to-[#0f0f1a]">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <School className="text-purple-400" size={40} />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Education
            </h2>
          </div>
          <p className="text-gray-400 text-lg mt-4">
            Academic journey and achievements
          </p>
        </motion.div>

        <div className="space-y-8">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="gradient-border"
            >
              <div className="gradient-border-content">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {item.school}
                    </h3>
                    <p className="text-xl text-purple-300 mb-3">{item.degree}</p>
                    {item.description && (
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={20} />
                    <span className="text-lg font-semibold">{item.period}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


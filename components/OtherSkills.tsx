'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Music, Palette, Code } from 'lucide-react';

interface SkillCategory {
  category: string;
  items: string[];
}

interface OtherSkillsProps {
  skills: SkillCategory[];
}

const categoryIcons: Record<string, any> = {
  'Instruments': Music,
  'Music': Music,
  'Other': Palette,
};

export default function OtherSkills({ skills }: OtherSkillsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section id="interests" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent to-[#0f0f1a]">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="text-purple-400" size={40} />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Other Skills & Interests
            </h2>
          </div>
          <p className="text-gray-400 text-lg mt-4">
            Creative pursuits and personal passions
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {skills.map((skillCategory, index) => {
            const Icon = categoryIcons[skillCategory.category] || Palette;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="gradient-border h-full">
                  <div className="gradient-border-content h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                        <Icon className="text-purple-400" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all">
                        {skillCategory.category}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {skillCategory.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className="flex items-center gap-3 p-3 glass rounded-lg group/item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: index * 0.2 + itemIndex * 0.1 }}
                          whileHover={{ scale: 1.05, x: 10 }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          <span className="text-gray-300 group-hover/item:text-white transition-colors">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}


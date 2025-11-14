'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, Activity } from 'lucide-react';

interface Sport {
  name: string;
  description: string;
  icon?: string;
}

interface SportsProps {
  sports: Sport[];
}

export default function Sports({ sports }: SportsProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <section id="sports" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="text-purple-400" size={40} />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text">
              Sports & Activities
            </h2>
          </div>
          <p className="text-gray-400 text-lg mt-4">
            Passion for physical fitness and competitive sports
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {sports.map((sport, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group perspective-1000"
            >
              <motion.div
                className="relative h-full glass rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                whileHover={{ rotateY: 5, rotateX: 5 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute top-4 right-4">
                  <Activity className="text-purple-400 opacity-50" size={32} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:gradient-text transition-all">
                    {sport.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {sport.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


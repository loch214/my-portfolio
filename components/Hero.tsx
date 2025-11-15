'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { PersonalData } from '@/data/personalData';

interface HeroProps {
  data: PersonalData;
}

export default function Hero({ data }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const floatClass = shouldReduceMotion ? '' : 'animate-float';
  const fadeIn = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8 }
        };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 ${floatClass}`} />
        <div className={`absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 ${floatClass}`} style={{ animationDelay: shouldReduceMotion ? undefined : '2s' }} />
        <div className={`absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 ${floatClass}`} style={{ animationDelay: shouldReduceMotion ? undefined : '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.div
            {...fadeIn(0.1)}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">{data.name}</span>
            </h1>
          </motion.div>

          <motion.div
            {...fadeIn(0.3)}
          >
            <h2 className="text-2xl md:text-4xl text-gray-100 mb-6 flex items-center justify-center gap-3">
              <Sparkles className="text-purple-400" size={28} />
              {data.title}
            </h2>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed"
            {...fadeIn(0.5)}
          >
            {data.bio}
          </motion.p>

          <motion.div
            {...fadeIn(0.7)}
            className="flex justify-center"
          >
            <motion.a
              href="#about"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white overflow-hidden"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore My Journey
                <ArrowDown className="group-hover:translate-y-1 transition-transform" size={20} />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={shouldReduceMotion ? undefined : { x: '-100%' }}
                whileHover={shouldReduceMotion ? undefined : { x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


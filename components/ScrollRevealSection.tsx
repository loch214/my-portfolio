'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Trophy, Music, Palette, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PersonalData } from '@/data/personalData';

interface ScrollRevealSectionProps {
  data: PersonalData;
}

export default function ScrollRevealSection({ data }: ScrollRevealSectionProps) {
  const educationRef = useRef<HTMLDivElement>(null);
  const sportsRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress: educationProgress } = useScroll({
    target: educationRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: sportsProgress } = useScroll({
    target: sportsRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: musicProgress } = useScroll({
    target: musicRef,
    offset: ["start end", "end start"]
  });

  const educationOpacity = useTransform(educationProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0, 1, 1, 0]);
  const educationY = useTransform(educationProgress, [0, 0.2, 0.5, 0.8, 1], [150, 100, 0, -50, -150]);
  const educationScale = useTransform(educationProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 0.9, 1, 0.95, 0.8]);

  const sportsOpacity = useTransform(sportsProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0, 1, 1, 0]);
  const sportsY = useTransform(sportsProgress, [0, 0.2, 0.5, 0.8, 1], [150, 100, 0, -50, -150]);
  const sportsScale = useTransform(sportsProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 0.9, 1, 0.95, 0.8]);

  const musicOpacity = useTransform(musicProgress, [0, 0.1, 0.3, 0.7, 1], [0.6, 0.9, 1, 0.95, 0.7]);
  const musicY = useTransform(musicProgress, [0, 0.1, 0.3, 0.7, 1], [60, 20, 0, -15, -40]);
  const musicScale = useTransform(musicProgress, [0, 0.1, 0.3, 0.7, 1], [0.97, 0.995, 1, 0.995, 0.97]);

  return (
    <>
      {/* Education Section */}
      <section id="education" ref={educationRef} className="min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative snap-start">
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: educationOpacity, y: educationY, scale: educationScale }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <GraduationCap className="text-blue-400" size={48} />
              <h2 className="text-4xl md:text-6xl font-bold gradient-text">
                Education
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            {data.education.map((edu, index) => (
              <motion.div
                key={index}
                className="glass rounded-2xl p-6 md:p-8 hover:scale-[1.01] transition-transform"
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {edu.school}
                    </h3>
                    <p className="text-xl text-blue-300 mb-1">
                      {edu.degree}
                      <span className="text-base text-gray-400 ml-3">({edu.period})</span>
                    </p>
                    {edu.stream && (
                      <p className="text-gray-400 text-base mb-1">Stream: {edu.stream}</p>
                    )}
                    {edu.location && (
                      <p className="text-gray-400 text-base mb-3">📍 {edu.location}</p>
                    )}
                  </div>
                </div>
                <p className="text-base md:text-lg text-gray-100 leading-relaxed mb-4 font-light tracking-wide">
                  {edu.description}
                </p>
                {edu.resultsPdf && (
                  <a
                    href={edu.resultsPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
                  >
                    <FileText size={20} />
                    <span>View Academic Results</span>
                    <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Sports Section */}
      <section id="sports" ref={sportsRef} className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-[#0f0f1a] to-transparent snap-start">
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: sportsOpacity, y: sportsY, scale: sportsScale }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Trophy className="text-green-400" size={48} />
              <h2 className="text-5xl md:text-7xl font-bold gradient-text">
                Sports & Achievements
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.sports.map((sport, index) => (
              <motion.div
                key={index}
                className="glass rounded-3xl p-8 hover:scale-[1.02] transition-transform group"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 50 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 bg-gradient-to-br ${sport.name === 'Swimming' ? 'from-blue-500/20 to-cyan-500/20' : 'from-green-500/20 to-emerald-500/20'} rounded-xl`}>
                    <Trophy className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white group-hover:gradient-text transition-all mb-2">
                      {sport.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-400">Duration: {sport.duration}</p>
                      {sport.years && (
                        <p className="text-gray-400">Years: {sport.years}</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light tracking-wide">
                  {sport.achievements}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Music & Art Section */}
      <section id="music-art" ref={musicRef} className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative snap-start">
        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: musicOpacity, y: musicY, scale: musicScale }}
          className="max-w-6xl mx-auto w-full"
        >
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Music className="text-pink-400" size={48} />
              <h2 className="text-5xl md:text-7xl font-bold gradient-text">
                Music & Art
              </h2>
            </div>
          </div>

          <div className="space-y-8 mb-12">
            <motion.div
              className="glass rounded-3xl p-8 md:p-10 hover:scale-[1.02] transition-transform"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed mb-6 font-light tracking-wide">
                Music is a constant companion and truly essential to my routine. Whether I am coding, studying, or cooking, it always plays in the background. Even though it may not work for everyone, I find it is the key to helping me focus more deeply and do my best work.
              </p>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-8 md:p-10 hover:scale-[1.02] transition-transform"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Music className="text-pink-400" size={28} />
                Instruments
              </h3>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed mb-6 font-light tracking-wide">
                {data.music.instruments.join(', ')}
              </p>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-8 md:p-10 hover:scale-[1.02] transition-transform"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Music className="text-pink-400" size={28} />
                Vocals
              </h3>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed mb-6 font-light tracking-wide">{data.music.singing}</p>
            </motion.div>

            <motion.div
              className="glass rounded-3xl p-8 md:p-10 hover:scale-[1.02] transition-transform"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Music className="text-pink-400" size={28} />
                Preferred Genres
              </h3>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light tracking-wide">{data.music.listening}</p>
            </motion.div>
          </div>

          <motion.div
            className="glass rounded-3xl p-8 md:p-12 hover:scale-[1.02] transition-transform"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Palette className="text-purple-400" size={28} />
              Art
            </h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {data.art.mediums.map((medium, index) => (
                <motion.span
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-lg text-gray-100 hover:text-white hover:scale-110 transition-all cursor-default"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {medium}
                </motion.span>
              ))}
            </div>
            <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light tracking-wide">{data.art.achievements}</p>
            <div className="mt-6">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <FileText size={20} />
                <span>View my arts</span>
                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}


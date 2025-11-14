'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users2, Calendar, Star } from 'lucide-react';
import { PersonalData } from '@/data/personalData';

interface ClubsAndSocietiesProps {
  data: PersonalData;
}

export default function ClubsAndSocieties({ data }: ClubsAndSocietiesProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section
      id="clubs"
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative snap-start"
    >
      <div className="max-w-6xl mx-auto w-full" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Users2 className="text-indigo-400" size={46} />
            <h2 className="text-4xl md:text-6xl font-bold gradient-text">
              Clubs & Societies
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Getting involved in student communities keeps me energized and improves how I learn and collaborate.
          </p>
        </motion.div>

        {data.clubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.clubs.map((club, index) => (
              <motion.div
                key={club.name}
                className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-4 hover:scale-[1.01] transition-transform"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.7 }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Star className="text-indigo-300" size={28} />
                    <h3 className="text-2xl font-semibold text-white">
                      {club.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-base">
                    {club.organization}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {club.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-purple-300" />
                      {club.period}
                    </span>
                  </div>
                </div>

                <ul className="list-disc list-inside text-gray-200 text-base leading-relaxed space-y-2 pl-1">
                  {club.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border border-dashed border-white/10 min-h-[220px] flex items-center justify-center text-gray-400 text-lg italic"
            aria-hidden="true"
          >
            Will add later 😪
          </div>
        )}
      </div>
    </section>
  );
}

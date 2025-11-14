'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Trophy, Music, X, ExternalLink, FileText } from 'lucide-react';
import { PersonalData } from '@/data/personalData';

interface InteractiveCardsProps {
  data: PersonalData;
}

export default function InteractiveCards({ data }: InteractiveCardsProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'introduction',
      icon: GraduationCap,
      title: 'About Me',
      color: 'from-purple-500 to-pink-500',
      content: (
        <div className="space-y-4">
          <p className="text-lg text-gray-300 leading-relaxed">
            {data.introduction}
          </p>
        </div>
      )
    },
    {
      id: 'education',
      icon: GraduationCap,
      title: 'Education',
      color: 'from-blue-500 to-cyan-500',
      content: (
        <div className="space-y-6">
          {data.education.map((edu, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{edu.school}</h3>
                  <p className="text-xl text-purple-300 mb-1">{edu.degree}</p>
                  {edu.stream && (
                    <p className="text-gray-400 text-sm mb-2">Stream: {edu.stream}</p>
                  )}
                  {edu.location && (
                    <p className="text-gray-400 text-sm mb-2">📍 {edu.location}</p>
                  )}
                </div>
                <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {edu.period}
                </span>
              </div>
              {edu.description && (
                <p className="text-gray-300 leading-relaxed mb-4">{edu.description}</p>
              )}
              {edu.resultsPdf && (
                <a
                  href={edu.resultsPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
                >
                  <FileText size={18} />
                  <span>View Academic Results</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'sports',
      icon: Trophy,
      title: 'Sports & Athletics',
      color: 'from-green-500 to-emerald-500',
      content: (
        <div className="space-y-4">
          {data.sports.map((sport, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 bg-gradient-to-br ${sport.name === 'Swimming' ? 'from-blue-500/20 to-cyan-500/20' : 'from-green-500/20 to-emerald-500/20'} rounded-lg`}>
                  <Trophy className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all">
                    {sport.name}
                  </h3>
                  {sport.duration && (
                    <p className="text-sm text-gray-400">Duration: {sport.duration}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed pl-16">{sport.achievements}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'music',
      icon: Music,
      title: 'Music & Arts',
      color: 'from-pink-500 to-rose-500',
      content: (
        <div className="space-y-6">
          <motion.div
            className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Music className="text-pink-400" size={24} />
              Instruments I Play
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.music.instruments.map((instrument, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-full text-gray-300 hover:text-white hover:scale-110 transition-all cursor-default"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {instrument}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Music className="text-pink-400" size={24} />
              Singing
            </h3>
            <p className="text-gray-300 leading-relaxed">{data.music.singing}</p>
          </motion.div>

          <motion.div
            className="glass rounded-xl p-6 hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Music className="text-pink-400" size={24} />
              Music I Listen To
            </h3>
            <p className="text-gray-300 leading-relaxed">{data.music.listening}</p>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <section id="explore" className="py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Explore My Journey
          </h2>
          <p className="text-gray-400 text-lg">
            Click on any card to discover more
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              >
                <motion.div
                  className="gradient-border h-full"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="gradient-border-content h-full p-8 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-3xl group-hover:opacity-30 group-hover:scale-150 transition-all duration-500`} />
                    <div className="relative z-10">
                      <motion.div
                        className="flex items-center gap-4 mb-4"
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          className={`p-4 bg-gradient-to-br ${card.color} rounded-xl`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Icon className="text-white" size={32} />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all">
                          {card.title}
                        </h3>
                      </motion.div>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Click to explore
                      </p>
                    </div>
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedCard && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCard(null)}
              />
              <motion.div
                className="fixed inset-4 md:inset-20 z-50 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 relative">
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  >
                    <X size={24} />
                  </button>
                  {cards.find(c => c.id === selectedCard)?.content}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


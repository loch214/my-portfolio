'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase } from 'react-icons/fa';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import SocialLinks from '@/components/SocialLinks';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';
import ProjectModal from '@/components/ProjectModal';
import { personalData, projectsData, type Project } from '@/data/personalData';

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a1a] to-[#0a0a1a]">
      <Hero data={personalData} />
      <AboutMe data={personalData} />
      <ScrollRevealSection data={personalData} />
      <section id="projects" className="py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <FaBriefcase className="text-indigo-400" size={46} />
              <h2 className="text-4xl md:text-6xl font-bold gradient-text">My Work & Projects</h2>
            </div>
            <motion.div
              className="glass rounded-3xl p-8 md:p-10 hover:scale-[1.02] transition-transform max-w-4xl mx-auto mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-gray-100 leading-relaxed">
                A curated mix of full-stack apps, AI experiments, and this portfolio. Click any card to learn more,
                explore the source, or jump straight into a live or recorded demo.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projectsData.map((project) => {
              const ProjectIcon = project.icon;
              return (
                <motion.button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group flex min-h-[220px] flex-col items-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/3 to-white/5 p-6 text-center shadow-[0_15px_40px_rgba(80,0,120,0.25)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-1 flex-col items-center justify-between gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-purple-200">
                      <ProjectIcon className="h-10 w-10" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>
      <SocialLinks links={personalData.socialLinks} />
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}


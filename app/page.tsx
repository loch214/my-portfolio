'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IconType } from 'react-icons';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import SocialLinks from '@/components/SocialLinks';
import ProjectModal from '@/components/ProjectModal';
import { personalData, projectsData, type Project } from '@/data/personalData';

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface ProjectCardProps {
  title: string;
  tags: string[];
  icon: IconType;
  onClick: () => void;
}

const ProjectCard = ({ title, tags, icon: Icon, onClick }: ProjectCardProps) => (
  <motion.button
    onClick={onClick}
    className="group card flex min-h-[200px] flex-col justify-between p-6 text-left transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    variants={cardVariants}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon size={26} className="text-accent" aria-hidden />
    <div>
      <h3 className="text-lg font-display text-ink mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.button>
);

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-paper">
      <Hero data={personalData} />
      <AboutMe data={personalData} />
      <ScrollRevealSection data={personalData} />
      <section id="projects" className="snap-section min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-xs text-muted">05</span>
              <span className="eyebrow">Projects</span>
              <span className="hairline flex-1" />
            </div>
            <p className="body-text max-w-2xl">
              Full-stack apps, a few AI experiments that did not always go to plan, and this site. Open a card for the story behind each one, plus source code or a demo.
            </p>
          </div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                tags={project.tags}
                icon={project.icon}
                onClick={() => setSelectedProject(project)}
              />
            ))}
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

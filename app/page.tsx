'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IconType } from 'react-icons';
import Hero from '@/components/Hero';
import AboutMe from '@/components/AboutMe';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import SocialLinks from '@/components/SocialLinks';
import ProjectModal from '@/components/ProjectModal';
import SectionHeading from '@/components/SectionHeading';
import { personalData, projectsData, type Project } from '@/data/personalData';

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

interface ProjectCardProps {
  index: number;
  title: string;
  tags: string[];
  icon: IconType;
  onClick: () => void;
}

const ProjectCard = ({ index, title, tags, icon: Icon, onClick }: ProjectCardProps) => (
  <motion.button
    onClick={onClick}
    className="card group flex flex-col overflow-hidden text-left transition-colors hover:border-accent/40"
    variants={cardVariants}
  >
    <div
      className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b border-line"
      style={{
        background:
          'radial-gradient(80% 100% at 50% 20%, color-mix(in srgb, var(--color-accent) 8%, transparent), var(--color-surface) 70%)',
      }}
    >
      <Icon
        size={40}
        strokeWidth={1.5}
        className="text-neutral-500 transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
        aria-hidden
      />
      <span className="t-data absolute left-3 top-3 rounded-sm border border-line bg-bg/70 px-2 py-1 text-accent backdrop-blur-sm">
        {String(index + 1).padStart(2, '0')}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <h3 className="t-h4 mb-3 text-neutral-100">{title}</h3>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {tags.slice(0, 4).map((tag) => (
          <span key={tag} className="t-meta rounded-sm border border-line px-2 py-0.5 text-neutral-300">
            {tag}
          </span>
        ))}
        {tags.length > 4 && (
          <span className="t-meta rounded-sm px-1.5 py-0.5 text-neutral-500">
            +{tags.length - 4}
          </span>
        )}
      </div>
    </div>
  </motion.button>
);

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <main className="min-h-screen bg-bg">
      <Hero data={personalData} />
      <AboutMe data={personalData} />
      <ScrollRevealSection data={personalData} />

      <section
        id="projects"
        className="snap-section relative flex min-h-screen items-center px-6 py-20 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <SectionHeading title="Things I've built" />
            <p className="t-lead">
              Full-stack apps, a few AI experiments that did not always go to plan, and this site.
              Open a card for the story behind each one, plus source code or a demo.
            </p>
          </div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {projectsData.map((project, index) => (
              <ProjectCard
                key={project.id}
                index={index}
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

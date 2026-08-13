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
import { ProjectsScene } from '@/components/illustrations';
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
  title: string;
  tags: string[];
  icon: IconType;
  onClick: () => void;
}

const ProjectCard = ({ title, tags, icon: Icon, onClick }: ProjectCardProps) => (
  <motion.button
    onClick={onClick}
    className="card elev-sm group flex min-h-[200px] flex-col items-start p-6 text-left transition-shadow hover:shadow-md"
    variants={cardVariants}
    whileHover={{ y: -5 }}
    whileTap={{ scale: 0.985 }}
  >
    <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-200 text-accent-700 transition-colors group-hover:bg-accent group-hover:text-bg">
      <Icon size={20} aria-hidden />
    </span>
    <h3 className="mb-3 font-heading text-xl leading-tight text-ink">{title}</h3>
    <div className="mt-auto flex flex-wrap gap-1.5">
      {tags.slice(0, 4).map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-800"
        >
          {tag}
        </span>
      ))}
      {tags.length > 4 && (
        <span className="rounded-full px-1.5 py-1 text-xs font-semibold text-muted">
          +{tags.length - 4}
        </span>
      )}
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
          <div className="mb-8 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <SectionHeading index="05" kicker="Projects" title="Things I've built" tone="sage" />
              <p className="body-text max-w-xl text-base">
                Full-stack apps, a few AI experiments that did not always go to plan, and this site.
                Open a card for the story behind each one, plus source code or a demo.
              </p>
            </div>

            <motion.div
              className="mx-auto hidden w-full max-w-[200px] lg:block lg:justify-self-end"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectsScene className="anim-float w-full" />
            </motion.div>
          </div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
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

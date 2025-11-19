'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Project } from '@/data/personalData';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={onClose}
      aria-label="Project details overlay"
    >
      <motion.div
        className="relative w-full max-w-4xl rounded-3xl bg-[#0a0615] p-6 sm:p-10 text-white shadow-[0_20px_80px_rgba(120,40,255,.3)]"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Details about ${project.title}`}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white/80 transition hover:border-white/60 hover:text-white"
          aria-label="Close project details"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold text-white">{project.title}</h2>
            <p className="mt-4 text-gray-200 leading-relaxed">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
            >
              View Source Code
            </a>
            {project.id !== 6 && project.id !== 5 && (
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:opacity-90"
                onClick={onClose}
              >
                View Case Study
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

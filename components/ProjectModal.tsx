'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
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

const formatRepoLabel = (url: string, fallback: string) => {
  try {
    const { pathname } = new URL(url);
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length >= 2) {
      const owner = segments[segments.length - 2];
      const repo = segments[segments.length - 1].replace(/\.git$/i, '');
      return `${owner}/${repo}`;
    }

    const repo = segments.pop();
    if (repo) {
      return repo.replace(/\.git$/i, '');
    }
  } catch (error) {
    // swallow parsing errors and fall through to fallback
  }

  return fallback;
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isRepoMenuOpen, setRepoMenuOpen] = useState(false);
  const repoMenuRef = useRef<HTMLDivElement | null>(null);

  const repoLinks = [
    {
      label: formatRepoLabel(project.githubUrl, 'Main Repository'),
      url: project.githubUrl,
    },
    ...(project.additionalGithubUrls?.map((url, index) => ({
      label: formatRepoLabel(url, `Additional Repository ${index + 1}`),
      url,
    })) ?? []),
  ];

  const hasMultipleRepos = repoLinks.length > 1;

  useEffect(() => {
    setRepoMenuOpen(false);
  }, [project]);

  useEffect(() => {
    if (!isRepoMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!repoMenuRef.current?.contains(event.target as Node)) {
        setRepoMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRepoMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRepoMenuOpen]);

  const handleOverlayClick = () => {
    setRepoMenuOpen(false);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={handleOverlayClick}
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
          onClick={() => {
            setRepoMenuOpen(false);
            onClose();
          }}
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
            {hasMultipleRepos ? (
              <div className="relative" ref={repoMenuRef}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setRepoMenuOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
                  aria-haspopup="menu"
                  aria-expanded={isRepoMenuOpen}
                >
                  View Source Code
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${isRepoMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isRepoMenuOpen && (
                  <div
                    className="absolute left-0 z-10 mt-2 w-60 rounded-2xl border border-white/10 bg-[#130a2a] p-2 shadow-xl shadow-purple-900/30"
                    role="menu"
                  >
                    {repoLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-xl px-3 py-2 text-sm text-gray-100 transition hover:bg-white/10"
                        role="menuitem"
                        onClick={() => setRepoMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-700/40 transition hover:opacity-90"
              >
                View Source Code
              </a>
            )}
            {project.id !== 6 && project.id !== 5 && (
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:opacity-90"
                onClick={() => {
                  setRepoMenuOpen(false);
                  onClose();
                }}
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

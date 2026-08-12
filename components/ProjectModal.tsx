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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
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
      label: formatRepoLabel(project.githubUrl, 'Main repository'),
      url: project.githubUrl,
    },
    ...(project.additionalGithubUrls?.map((url, index) => ({
      label: formatRepoLabel(url, `Additional repository ${index + 1}`),
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={handleOverlayClick}
      aria-label="Project details overlay"
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto border border-line bg-surface p-6 sm:p-10 text-ink"
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
          className="absolute right-5 top-5 border border-line p-2 text-muted transition hover:border-accent hover:text-accent"
          aria-label="Close project details"
        >
          <X size={18} />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-display text-ink pr-10">{project.title}</h2>
            <p className="mt-4 body-text whitespace-pre-line">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-line px-3 py-1 font-mono text-xs text-muted"
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
                  className="inline-flex items-center justify-center border border-accent px-5 py-2.5 font-mono text-sm text-accent transition hover:bg-accent-soft"
                  aria-haspopup="menu"
                  aria-expanded={isRepoMenuOpen}
                >
                  View source
                  <ChevronDown
                    size={16}
                    className={`ml-2 transition-transform ${isRepoMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isRepoMenuOpen && (
                  <div
                    className="absolute left-0 z-10 mt-2 w-60 border border-line bg-surface p-2 shadow-lg shadow-ink/5"
                    role="menu"
                  >
                    {repoLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 font-mono text-sm text-ink-soft transition hover:bg-accent-soft hover:text-accent"
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
                className="inline-flex items-center justify-center border border-accent px-5 py-2.5 font-mono text-sm text-accent transition hover:bg-accent-soft"
              >
                View source
              </a>
            )}
            {project.id !== 6 && project.id !== 5 && (
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center justify-center border border-line px-5 py-2.5 font-mono text-sm text-ink transition hover:border-accent hover:text-accent"
                onClick={() => {
                  setRepoMenuOpen(false);
                  onClose();
                }}
              >
                Case study
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

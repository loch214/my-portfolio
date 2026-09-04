'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import type { Project } from '@/data/personalData';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
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

  useScrollLock(true);

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

  /* A case study is only worth opening if it has media to show. Lens Lock
     (id 7) has media: [] and was linking to a page with a heading, a repo
     button and nothing under them, because this gate was a hardcoded id list
     that predated it. The two ids are a separate, older opt-out and are kept
     as-is; they belong in personalData as a field rather than here. */
  const hasCaseStudy =
    project.media.length > 0 && project.id !== 5 && project.id !== 6;

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
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={handleOverlayClick}
      aria-label="Project details overlay"
      data-native-scroll
    >
      <motion.div
        className="card elev-lg relative max-h-[85vh] w-full max-w-2xl overflow-y-auto overscroll-contain p-7 sm:p-10"
        variants={modalVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
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
          className="btn-icon absolute right-4 top-4 border border-line hover:border-accent hover:text-accent"
          aria-label="Close project details"
        >
          <X size={18} strokeWidth={2.75} />
        </button>

        <div className="space-y-6">
          <div>
            <h2 className="t-h3 pr-12 text-neutral-100">{project.title}</h2>
            <p className="body-text mt-3 whitespace-pre-line">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="chip"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            {hasMultipleRepos ? (
              <div className="relative" ref={repoMenuRef}>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setRepoMenuOpen((prev) => !prev);
                  }}
                  className="btn btn-primary"
                  aria-haspopup="menu"
                  aria-expanded={isRepoMenuOpen}
                >
                  View source
                  <ChevronDown
                    size={16}
                    strokeWidth={2.75}
                    className={`transition-transform ${isRepoMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isRepoMenuOpen && (
                  <div
                    className="elev-md card absolute left-0 z-10 mt-2 w-64 p-2"
                    role="menu"
                  >
                    {repoLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="t-btn block rounded-sm px-4 py-3 text-neutral-100 transition-colors hover:bg-accent hover:text-bg"
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
                className="btn btn-primary"
              >
                View source
              </a>
            )}
            {hasCaseStudy && (
              <Link
                href={`/projects/${project.id}`}
                className="btn btn-outline"
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

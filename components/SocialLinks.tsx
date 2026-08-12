'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

const iconMap: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

export default function SocialLinks({ links }: SocialLinksProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
      },
    },
  };

  return (
    <section id="connect" className="snap-section min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto w-full" ref={ref}>
        <motion.div
          className="flex items-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-muted">06</span>
          <span className="eyebrow">Contact</span>
          <span className="hairline flex-1" />
        </motion.div>

        <p className="body-text mb-10 max-w-xl">
          The fastest way to reach me is GitHub or LinkedIn &mdash; I check both more often than email.
        </p>

        <motion.div
          className="flex flex-wrap gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {links.map((link, index) => {
            const Icon = iconMap[link.icon.toLowerCase()] || ExternalLink;
            return (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                aria-label={`Open ${link.platform}`}
                className="group flex items-center gap-3 border border-line bg-surface px-6 py-4 min-w-[160px] transition hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Icon
                  className="text-muted group-hover:text-accent transition-colors"
                  size={20}
                />
                <span className="font-mono text-sm text-ink-soft group-hover:text-ink transition-colors">
                  {link.platform}
                </span>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-24 font-mono text-xs text-muted"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <p>&copy; {new Date().getFullYear()} Lochana Dahanayake</p>
        </motion.div>
      </div>
    </section>
  );
}

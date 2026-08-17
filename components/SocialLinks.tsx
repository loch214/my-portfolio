'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

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
    hidden: { opacity: 0, y: 14 },
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
    <section
      id="connect"
      className="snap-section relative flex min-h-screen flex-col justify-center px-6 py-20 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-5xl" ref={ref}>
        <SectionHeading index="06" total="07" title="Say hello" />

        <p className="body-text mb-7 max-w-lg text-[17px]">
          The fastest way to reach me is GitHub or LinkedIn &mdash; I check both more often than
          email.
        </p>

        <motion.div
          className="flex flex-wrap gap-3"
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
                className="group card inline-flex items-center gap-2.5 px-6 py-3.5 font-mono text-[13px] uppercase tracking-[0.06em] text-neutral-100 transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={18} strokeWidth={2} />
                <span>{link.platform}</span>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-12 font-mono text-[13px] text-neutral-500"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          &copy; {new Date().getFullYear()} Lochana Dahanayake
        </motion.p>
      </div>
    </section>
  );
}

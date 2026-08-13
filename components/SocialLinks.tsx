'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { ContactScene } from '@/components/illustrations';

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
        <SectionHeading index="06" kicker="Contact" title="Say hello" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <p className="body-text mb-7 max-w-lg text-base">
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
                    className="group inline-flex items-center gap-2.5 rounded-full bg-surface px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-accent hover:text-bg"
                  >
                    <Icon size={19} strokeWidth={2.75} />
                    <span className="text-sm">{link.platform}</span>
                  </motion.a>
                );
              })}
            </motion.div>

            <motion.p
              className="mt-12 text-sm text-muted"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              &copy; {new Date().getFullYear()} Lochana Dahanayake
            </motion.p>
          </div>

          <motion.div
            className="mx-auto w-full max-w-[260px] lg:max-w-[320px] lg:justify-self-end"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactScene className="anim-float w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Linkedin, Twitter, Instagram, Mail, ExternalLink } from 'lucide-react';
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
  mail: Mail,
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
        <SectionHeading title="Say hello" />

        <p className="t-lead mb-7">
          Have a project in mind, a question, or just want to connect? Reach out through any of
          these.
        </p>

        <motion.div
          className="flex flex-wrap gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {links.map((link, index) => {
            const Icon = iconMap[link.icon.toLowerCase()] || ExternalLink;
            const isMailto = link.url.startsWith('mailto:');
            return (
              <motion.a
                key={index}
                href={link.url}
                target={isMailto ? undefined : '_blank'}
                rel={isMailto ? undefined : 'noopener noreferrer'}
                variants={itemVariants}
                aria-label={isMailto ? 'Email me' : `Open ${link.platform}`}
                className="btn btn-outline group bg-surface"
              >
                <Icon size={18} strokeWidth={2} />
                <span>{isMailto ? link.url.replace('mailto:', '') : link.platform}</span>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.p
          className="t-data mt-12"
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

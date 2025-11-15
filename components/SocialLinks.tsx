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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
      },
    },
  };

  return (
    <section id="connect" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Let&rsquo;s Connect
          </h2>
          <p className="text-gray-200 text-lg mt-4">
            Find me on these platforms
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
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
                className="group relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 rounded-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="gradient-border">
                  <div className="gradient-border-content p-6 min-w-[120px] text-center">
                    <Icon
                      className="mx-auto mb-3 text-white group-hover:text-purple-400 transition-colors"
                      size={32}
                    />
                    <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">
                      {link.platform}
                    </p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                  initial={false}
                />
              </motion.a>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-20 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </motion.div>
      </div>
    </section>
  );
}


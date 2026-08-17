'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  index: string;
  total: string;
  title: string;
}

/* One compound heading, not a caption stacked over a headline: the running
   chapter mark sits inline beside the title at the same baseline, using the
   same 1–7 numbering the section-nav rail and drawer already carry — real
   wayfinding, not a decorative eyebrow. */
export default function SectionHeading({ index, total, title }: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-8 flex items-baseline gap-4 sm:gap-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-mono text-sm text-accent sm:text-base">
        {index}<span className="text-neutral-600">/{total}</span>
      </span>
      <h2 className="font-heading text-[1.9rem] leading-[0.95] text-neutral-100 sm:text-[2.4rem]">
        {title}
      </h2>
    </motion.div>
  );
}

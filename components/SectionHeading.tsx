'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
}

/* Just the title. There was a running "02/07" chapter mark here; it was dropped
   because the count never matched what the reader could see — the hero carries no
   heading, so the last section read 06/07 — and the sequence carried no
   information the section-nav rail wasn't already showing. */
export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <motion.h2
      className="t-h2 mb-8 text-neutral-100"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {title}
    </motion.h2>
  );
}

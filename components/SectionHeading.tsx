'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  tone?: 'accent' | 'sage';
}

export default function SectionHeading({
  index,
  kicker,
  title,
  tone = 'accent',
}: SectionHeadingProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-body text-xs font-bold ${
            tone === 'sage' ? 'bg-sage-200 text-sage-800' : 'bg-accent-200 text-accent-800'
          }`}
        >
          {index}
        </span>
        <span className={`kicker ${tone === 'sage' ? 'kicker-sage' : ''}`}>{kicker}</span>
      </div>
      <h2 className="font-heading text-[1.75rem] text-ink sm:text-[2rem]">{title}</h2>
    </motion.div>
  );
}

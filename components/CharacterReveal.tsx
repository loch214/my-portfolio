'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface CharacterRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'span' | 'div';
}

/* Per-character reveal for display type — the choreography the reference
   components carried with GSAP, built on the framer-motion stack already in
   this project. Each glyph rises and unblurs on its own beat; words keep
   their natural wrapping via inline-block spans with a hair of trailing space. */
export default function CharacterReveal({
  text,
  className = '',
  delay = 0,
  as = 'span',
}: CharacterRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    if (as === 'h1') return <h1 className={className}>{text}</h1>;
    if (as === 'div') return <div className={className}>{text}</div>;
    return <span className={className}>{text}</span>;
  }

  let charIndex = 0;
  const MotionTag = as === 'h1' ? motion.h1 : as === 'div' ? motion.div : motion.span;

  return (
    <MotionTag className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex whitespace-nowrap" style={{ marginRight: '0.28em' }}>
          {word.split('').map((char, ci) => {
            const i = charIndex++;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  delay: delay + i * 0.028,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';

const sideMenuItems = [
  { name: 'Home', href: '#home', id: 'home' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Education', href: '#education', id: 'education' },
  { name: 'Sports', href: '#sports', id: 'sports' },
  { name: 'Hobbies', href: '#hobbies', id: 'hobbies' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Contact', href: '#connect', id: 'connect' },
  { name: 'Gallery', href: '/gallery', id: null },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isSideMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSideMenuOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-paper/95 border-line backdrop-blur py-3'
          : 'bg-paper/80 border-transparent backdrop-blur py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            className="font-mono text-sm tracking-widest text-ink hover:text-accent transition-colors"
          >
            LD<span className="text-accent">.</span>
          </a>

          <button
            className="flex items-center gap-2 rounded-sm border border-line px-4 py-2 text-sm font-mono text-ink transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            onClick={() => setIsSideMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSideMenuOpen}
          >
            <Menu size={16} aria-hidden />
            <span>menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSideMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSideMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-screen w-80 max-w-sm bg-surface border-l border-line z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between p-6 border-b border-line">
                <span className="eyebrow">Navigate</span>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-sm p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-1">
                {sideMenuItems.map((item, index) => {
                  const isActive = item.id !== null && item.id === activeSection;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-sm px-4 py-3 text-base transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                        isActive ? 'text-accent bg-accent-soft' : 'text-ink-soft hover:text-ink hover:bg-accent-soft'
                      }`}
                      onClick={() => setIsSideMenuOpen(false)}
                      aria-label={`Go to ${item.name}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className={`font-mono text-xs ${isActive ? 'text-accent' : 'text-muted'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {item.name}
                    </a>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

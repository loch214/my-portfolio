'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useScrollLock } from '@/hooks/useScrollLock';

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

  useScrollLock(isSideMenuOpen);

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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-bg/90 py-3 shadow-sm backdrop-blur' : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <a
            href="#home"
            className="rounded-full font-heading text-lg text-ink transition-colors hover:text-accent-700"
          >
            Lochana<span className="text-accent">.</span>
          </a>

          <button
            className="inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-bg"
            onClick={() => setIsSideMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSideMenuOpen}
          >
            <Menu size={17} strokeWidth={2.75} aria-hidden />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSideMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSideMenuOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col rounded-l-card bg-surface shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between px-7 pb-4 pt-7">
                <span className="kicker">Navigate</span>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-accent hover:text-bg"
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={2.75} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto overscroll-contain px-5 pb-7">
                {sideMenuItems.map((item, index) => {
                  const isActive = item.id !== null && item.id === activeSection;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`mb-1 flex items-center gap-3 rounded-full px-4 py-3 transition-colors ${
                        isActive
                          ? 'bg-accent text-bg'
                          : 'text-ink hover:bg-neutral-300/60'
                      }`}
                      onClick={() => setIsSideMenuOpen(false)}
                      aria-label={`Go to ${item.name}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span
                        className={`text-xs font-bold ${isActive ? 'text-bg/70' : 'text-muted'}`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-heading text-base">{item.name}</span>
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

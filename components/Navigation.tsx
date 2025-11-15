'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const sideMenuItems = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Sports & Achievements', href: '#sports' },
  { name: 'Music & Art', href: '#music-art' },
  { name: 'Clubs & Societies', href: '#clubs' },
  { name: 'Connect', href: '#connect' },
  { name: 'Gallery', href: '/gallery' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
          ? 'glass border-white/15 shadow-2xl shadow-purple-500/10 py-3'
          : 'bg-black/50 backdrop-blur border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            className="text-2xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Portfolio
          </motion.a>

          {/* Menu Button */}
          <button
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
            onClick={() => setIsSideMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSideMenuOpen}
          >
            <Menu size={20} aria-hidden />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSideMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSideMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 h-screen w-80 max-w-sm bg-[#070015]/95 backdrop-blur-2xl border-l border-white/15 shadow-[0_0_40px_rgba(120,40,255,0.4)] z-50 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-lg font-semibold gradient-text">Navigate</span>
                <button
                  onClick={() => setIsSideMenuOpen(false)}
                  className="text-gray-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 rounded-full p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-3">
                {sideMenuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
                    onClick={() => setIsSideMenuOpen(false)}
                    aria-label={`Go to ${item.name}`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Connect', href: '#connect' },
];

const sideMenuItems = [
  { name: 'Home', href: '#home' },
  { name: 'About Me', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Sports & Achievements', href: '#sports' },
  { name: 'Music & Art', href: '#music-art' },
  { name: 'Clubs & Societies', href: '#clubs' },
  { name: 'Explore Cards', href: '#explore' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-3' : 'py-6'
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500"
            onClick={() => setIsSideMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSideMenuOpen}
          >
            <Menu size={24} />
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
              className="fixed top-0 right-0 h-full w-80 max-w-full glass z-50 flex flex-col"
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


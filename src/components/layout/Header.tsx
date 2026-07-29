"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Download, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'TRANG CHỦ', href: '#home', active: true },
    { name: 'BỘ SƯU TẬP', href: '#collections' },
    { name: 'QUÀ TẶNG DOANH NGHIỆP', href: '#corporate' },
    { name: 'CÁ NHÂN HÓA', href: '#customization' },
    { name: 'TIN TỨC', href: '#news' },
    { name: 'LIÊN HỆ', href: '#contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ backgroundColor: 'rgba(255, 255, 255, 0)', boxShadow: '0px 0px 0px rgba(0,0,0,0)' }}
        animate={{ 
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 1)',
          boxShadow: isScrolled ? '0px 4px 20px rgba(0,0,0,0.05)' : '0px 0px 0px rgba(0,0,0,0)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(0,0,0,0.05)'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between h-[80px] md:h-[90px]">
          
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 -ml-2 mr-2 text-vinex-blue hover:bg-vinex-blue/5 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <motion.div 
              className="flex-shrink-0 xl:-ml-[var(--spacing-clear-space,24px)] lg:mr-8 xl:mr-[100px]"
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo lang={lang as 'en' | 'vi'} className="text-vinex-blue h-6 md:h-8" />
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center lg:gap-5 xl:gap-8 2xl:gap-10" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.name)}
                className={`text-[12px] xl:text-[13px] font-bold tracking-wider xl:tracking-widest uppercase transition-colors relative py-2 whitespace-nowrap ${
                  link.active || hoveredLink === link.name ? 'text-vinex-blue' : 'text-vinex-black/70 hover:text-vinex-blue'
                }`}
              >
                {link.name}
                {(link.active || hoveredLink === link.name) && (
                  <motion.span 
                    layoutId="navIndicator"
                    className="w-full h-[2px] bg-vinex-yellow absolute bottom-0 left-0"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-2 md:gap-3 px-4 md:px-7 py-2.5 md:py-3.5 text-[10px] md:text-[11px] font-extrabold tracking-widest text-white bg-vinex-blue hover:bg-vinex-blue/95 rounded-sm uppercase shadow-[0_4px_14px_0_rgba(17,76,90,0.2)] hover:shadow-[0_6px_20px_rgba(17,76,90,0.3)] transition-all duration-300 overflow-hidden whitespace-nowrap"
            >
              {/* Glossy sweep effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep"></div>
              
              <span className="hidden sm:inline">NHẬN CATALOGUE</span>
              <span className="sm:hidden">CATALOGUE</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 3, y: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Download className="w-3 h-3 md:w-4 md:h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <Logo lang={lang as 'en' | 'vi'} className="text-vinex-blue h-6" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-vinex-blue hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase transition-colors ${
                      link.active 
                        ? 'bg-vinex-blue/5 text-vinex-blue' 
                        : 'text-vinex-black/70 hover:bg-gray-50 hover:text-vinex-blue'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-light text-center">
                  © 2024 VINEX. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

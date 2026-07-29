"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Download } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  const navLinks = [
    { name: 'TRANG CHỦ', href: '#home', active: true },
    { name: 'BỘ SƯU TẬP', href: '#collections' },
    { name: 'QUÀ TẶNG DOANH NGHIỆP', href: '#corporate' },
    { name: 'CÁ NHÂN HÓA', href: '#customization' },
    { name: 'TIN TỨC', href: '#news' },
    { name: 'LIÊN HỆ', href: '#contact' },
  ];

  return (
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
      <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex items-center h-[90px]">
        <motion.div 
          className="flex-shrink-0 -ml-[var(--spacing-clear-space,24px)] mr-24 lg:mr-[140px]"
          animate={{ scale: isScrolled ? 0.9 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo lang={lang as 'en' | 'vi'} className="text-vinex-blue" />
        </motion.div>

        <nav className="hidden lg:flex items-center gap-10" onMouseLeave={() => setHoveredLink(null)}>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              className={`text-[13px] font-bold tracking-widest uppercase transition-colors relative py-2 ${
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

        <div className="flex items-center gap-4 ml-auto">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center gap-3 px-7 py-3.5 text-[11px] font-extrabold tracking-widest text-white bg-vinex-blue hover:bg-vinex-blue/95 rounded-sm uppercase shadow-[0_4px_14px_0_rgba(17,76,90,0.2)] hover:shadow-[0_6px_20px_rgba(17,76,90,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Glossy sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep"></div>
            
            <span>NHẬN CATALOGUE</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 3, y: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Download className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

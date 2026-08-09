"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
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
    { name: 'TRANG CHỦ', href: `/${lang}` },
    { name: 'GIỚI THIỆU', href: `/${lang}/gioi-thieu` },
    { 
      name: 'NĂNG LỰC', 
      href: '#',
      hasDropdown: true,
      children: [
        { name: 'Nhà máy bóc tách điều', href: `/${lang}/nha-may-boc-tach-dieu` },
        { name: 'Nhân điều trắng', href: `/${lang}/nhan-dieu-trang` }
      ]
    },
    { 
      name: 'SẢN PHẨM', 
      href: `/${lang}/san-pham`,
      hasDropdown: true,
      children: [
        { name: 'Hạt điều tẩm vị', href: `/${lang}/san-pham#hat-dieu` },
        { name: 'Trà & cà phê', href: `/${lang}/san-pham#tra-ca-phe` },
        { name: 'Bánh & kẹo', href: `/${lang}/san-pham#banh-keo` },
        { name: 'Nông sản chế biến', href: `/${lang}/san-pham#nong-san` }
      ]
    },
    { name: 'QUÀ TẶNG', href: `/${lang}/qua-tang-doanh-nghiep` },
    { name: 'LIÊN HỆ', href: `/${lang}/lien-he` },
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
            <motion.div 
              className="flex-shrink-0 -ml-3 md:-ml-4 xl:-ml-[var(--spacing-clear-space,24px)] lg:mr-8 xl:mr-[100px]"
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo lang={lang as 'en' | 'vi'} className="text-vinex-blue h-6 md:h-8" />
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center lg:gap-5 xl:gap-8 2xl:gap-10" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group h-full py-6 flex items-center"
                onMouseEnter={() => setHoveredLink(link.name)}
              >
                <Link
                  href={link.href}
                  className={`text-[12px] xl:text-[13px] font-bold tracking-wider xl:tracking-widest uppercase transition-colors relative py-2 whitespace-nowrap ${
                    pathname === link.href || hoveredLink === link.name ? 'text-vinex-blue' : 'text-vinex-black/70 hover:text-vinex-blue'
                  }`}
                >
                  {link.name}
                  {(pathname === link.href || hoveredLink === link.name) && (
                    <motion.span 
                      layoutId="navIndicator"
                      className="w-full h-[2px] bg-vinex-yellow absolute bottom-0 left-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>

                {link.hasDropdown && (
                  <div className="absolute top-[80px] md:top-[90px] left-0 bg-white shadow-lg border border-gray-100 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] py-2 flex flex-col">
                    {link.children?.map(child => (
                      <Link 
                        key={child.name} 
                        href={child.href}
                        className="px-5 py-3 hover:bg-vinex-blue/5 text-sm font-medium text-gray-700 hover:text-vinex-blue transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Link href={`/${lang}/lien-he`}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(13,89,98,0.6)",
                    "0 0 0 12px rgba(13,89,98,0)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }
                }}
                className="group relative flex items-center gap-2 md:gap-3 px-4 md:px-7 py-2.5 md:py-3.5 text-[10px] md:text-[11px] font-extrabold tracking-widest text-white bg-gradient-to-r from-vinex-blue to-[#2B8390] rounded-md uppercase overflow-hidden whitespace-nowrap"
              >
                {/* Continuous sweep effect */}
                <motion.div 
                  className="absolute inset-0 w-[150%] -left-[50%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
                <span className="relative z-10">NHẬN TƯ VẤN</span>
              </motion.button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 -mr-2 ml-1 text-vinex-blue hover:bg-vinex-blue/5 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 overflow-hidden">
                <Logo lang={lang as 'en' | 'vi'} variant="small" className="text-vinex-blue -ml-4" />
                <div className="flex items-center gap-1">
                  <LanguageSwitcher />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-400 hover:text-vinex-blue hover:bg-gray-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-[13px] font-bold tracking-widest uppercase transition-colors ${
                        pathname === link.href
                          ? 'bg-vinex-blue/5 text-vinex-blue' 
                          : 'text-vinex-black/70 hover:bg-gray-50 hover:text-vinex-blue'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {link.hasDropdown && link.children && (
                      <div className="pl-6 flex flex-col mt-1">
                        {link.children.map(child => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-vinex-blue transition-colors"
                          >
                            - {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
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

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 10;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

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
    { name: lang === 'en' ? 'PRODUCTS & COLLECTIONS' : 'SẢN PHẨM & BỘ SƯU TẬP', href: `/${lang}/collections` },
    { name: lang === 'en' ? 'CORPORATE GIFTS' : 'QUÀ DOANH NGHIỆP', href: `/${lang}/corporate-gifts` },
    { name: lang === 'en' ? 'BESPOKE DESIGN' : 'THIẾT KẾ RIÊNG', href: `/${lang}/custom-gifts` },
    { name: lang === 'en' ? 'VINEX STORY' : 'CÂU CHUYỆN VINEX', href: `/${lang}/gioi-thieu` },
    { name: 'JOURNAL', href: `/${lang}/kien-thuc` },
    { name: lang === 'en' ? 'CONTACT' : 'LIÊN HỆ', href: `/${lang}/contact` },
  ];

  return (
    <>
      <motion.header
        initial={{ backgroundColor: 'rgba(250, 248, 242, 0)' }}
        animate={{ 
          backgroundColor: isScrolled ? 'rgba(250, 248, 242, 0.98)' : 'rgba(250, 248, 242, 0)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent'
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between h-[80px]">
          
          <div className="flex items-center">
            <Link href={`/${lang}`} className="block">
              <span className="text-vinex-teal text-3xl font-marcellus tracking-wide">VINEX</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[11px] font-bold tracking-[0.08em] uppercase transition-colors hover:text-vinex-teal ${
                  pathname === link.href ? 'text-vinex-teal' : 'text-vinex-charcoal'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold tracking-widest text-vinex-charcoal">
              <Link href={pathname.replace(/^\/(vi|en)/, '/vi')} className={lang === 'vi' ? 'text-vinex-teal' : 'hover:text-vinex-teal transition-colors'}>VI</Link>
              <span className="text-vinex-charcoal/30">|</span>
              <Link href={pathname.replace(/^\/(vi|en)/, '/en')} className={lang === 'en' ? 'text-vinex-teal' : 'hover:text-vinex-teal transition-colors'}>EN</Link>
            </div>
            
            <Link href={`/${lang}/request-quote`} className="hidden md:block">
              <button className="px-6 py-2.5 bg-vinex-teal text-white font-bold text-[11px] tracking-widest uppercase hover:bg-vinex-charcoal transition-colors">
                {lang === 'en' ? 'GET CONSULTATION' : 'NHẬN TƯ VẤN'}
              </button>
            </Link>

            <button 
              className="lg:hidden text-vinex-charcoal"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-vinex-charcoal/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-vinex-ivory z-50 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-vinex-charcoal/10">
                <span className="text-vinex-teal text-2xl font-marcellus">VINEX</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-vinex-charcoal" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[13px] font-bold tracking-widest uppercase text-vinex-charcoal"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto p-6">
                 <Link href={`/${lang}/request-quote`} onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-3 bg-vinex-teal text-white font-bold text-[11px] tracking-widest uppercase">
                    {lang === 'en' ? 'GET CONSULTATION' : 'NHẬN TƯ VẤN'}
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

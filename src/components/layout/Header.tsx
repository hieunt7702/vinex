"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useDict } from '@/hooks/useDict';

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const t = useDict();

  const navLinks = [
    { name: t.nav.home, href: `/${lang}` },
    { name: t.nav.about, href: `/${lang}/gioi-thieu` },
    { 
      name: t.nav.capability, 
      href: '#',
      dropdown: [
        { name: t.nav.capability_story, href: `/${lang}/gioi-thieu` },
        { name: t.nav.capability_factory, href: `/${lang}/nha-may-boc-tach-dieu` },
        { name: t.nav.capability_cashew, href: `/${lang}/nhan-dieu-trang` }
      ]
    },
    { 
      name: t.nav.products, 
      href: `/${lang}/san-pham`,
      dropdown: [
        { name: t.nav.products_cashew, href: `/${lang}/san-pham?category=hat-dieu` },
        { name: t.nav.products_tea, href: `/${lang}/san-pham?category=tra-ca-phe` },
        { name: t.nav.products_bakery, href: `/${lang}/san-pham?category=banh-keo` },
        { name: t.nav.products_agri, href: `/${lang}/san-pham?category=nong-san` }
      ]
    },
    { name: t.nav.gifts, href: `/${lang}/qua-tang-doanh-nghiep` },
    { name: t.nav.contact, href: lang === 'en' ? `/${lang}/contact` : `/${lang}/lien-he` },
  ];

  return (
    <>
      <motion.header
        initial={{ backgroundColor: 'rgba(250, 248, 242, 0)', backdropFilter: 'blur(0px)' }}
        animate={{ 
          backgroundColor: isScrolled ? 'rgba(250, 248, 242, 0.85)' : 'rgba(250, 248, 242, 0)',
          borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 flex items-center justify-between h-[80px]">
          
          <div className="flex items-center">
            <Logo lang={lang} />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
            {navLinks.map((link) => {
              const isDropdownActive = link.dropdown?.some(sub => pathname === sub.href);
              
              return (
                <div key={link.name} className="relative group flex items-center h-full">
                  {link.dropdown ? (
                    <>
                      <button
                        className={`relative flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors hover:text-vinex-teal py-8 ${
                          isDropdownActive ? 'text-vinex-teal' : 'text-vinex-charcoal'
                        }`}
                      >
                        {link.name}
                        <svg className="w-2.5 h-2.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                        <span className={`absolute bottom-6 left-0 h-[1.5px] bg-vinex-teal transition-all duration-300 ${isDropdownActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-[calc(100%-16px)] left-0 w-64 bg-vinex-ivory border border-vinex-teal/10 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 py-3">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-6 py-2.5 text-[11px] font-bold tracking-[0.05em] uppercase hover:bg-vinex-teal/5 transition-colors ${
                              pathname === subItem.href ? 'text-vinex-teal' : 'text-vinex-charcoal/80 hover:text-vinex-teal'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative text-[11px] font-bold tracking-[0.08em] uppercase transition-colors hover:text-vinex-teal py-8 ${
                        pathname === link.href ? 'text-vinex-teal' : 'text-vinex-charcoal'
                      }`}
                    >
                      {link.name}
                      <span className={`absolute bottom-6 left-0 h-[1.5px] bg-vinex-teal transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold tracking-widest text-vinex-charcoal">
              <Link href={pathname.replace(/^\/(vi|en)/, '/vi')} className={lang === 'vi' ? 'text-vinex-teal' : 'hover:text-vinex-teal transition-colors'}>VI</Link>
              <span className="text-vinex-charcoal/30">|</span>
              <Link href={pathname.replace(/^\/(vi|en)/, '/en')} className={lang === 'en' ? 'text-vinex-teal' : 'hover:text-vinex-teal transition-colors'}>EN</Link>
            </div>
            
            <Link href={`/${lang}/request-quote`} className="hidden md:block">
              <button className="relative overflow-hidden group px-6 py-2.5 bg-vinex-teal text-white font-bold text-[11px] tracking-widest uppercase shadow-[0_0_15px_rgba(13,89,98,0.3)] hover:shadow-[0_0_20px_rgba(13,89,98,0.5)] transition-all duration-300">
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] animate-shine z-20" />
                <span className="relative z-10 group-hover:text-vinex-gold transition-colors duration-300">{t.nav.cta}</span>
                <span className="absolute inset-0 bg-vinex-charcoal transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-[#FAF8F2] z-50 lg:hidden flex flex-col"
          >
            {/* Top Bar matching Header height */}
            <div className="flex items-center justify-between h-[80px] px-4 md:px-8 border-b border-vinex-teal/10">
              <div className="flex items-center">
                <Logo lang={lang} />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-vinex-charcoal hover:text-vinex-teal transition-colors"
              >
                <X className="w-8 h-8" strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Menu Links */}
            <div className="px-4 md:px-8 py-8 flex flex-col gap-8 overflow-y-auto flex-1">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col gap-4">
                  {link.dropdown ? (
                    <>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-vinex-gold">
                        {link.name}
                      </span>
                      <div className="flex flex-col gap-4 pl-4 border-l border-vinex-gold/30">
                        {link.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-[17px] font-marcellus tracking-wide ${
                              pathname === subItem.href ? 'text-vinex-teal' : 'text-vinex-charcoal/80 hover:text-vinex-teal'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-[20px] font-marcellus tracking-wide ${
                        pathname === link.href ? 'text-vinex-teal' : 'text-vinex-charcoal hover:text-vinex-teal'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Bottom Actions */}
            <div className="mt-auto p-4 md:p-8 py-8 border-t border-vinex-teal/10 bg-white">
              <div className="mb-6 grid grid-cols-1 gap-4 text-[14px] md:text-[15px] font-light text-vinex-charcoal/80">
                <a href="tel:+84966967966" className="flex items-center gap-3 hover:text-vinex-teal transition-colors">
                  <Phone className="w-4 h-4 text-vinex-gold" />
                  <span>(+84) 966 967 966</span>
                </a>
                <a href="mailto:info@vinexgroup.vn" className="flex items-center gap-3 hover:text-vinex-teal transition-colors">
                  <Mail className="w-4 h-4 text-vinex-gold" />
                  <span>info@vinexgroup.vn</span>
                </a>
              </div>

               <Link href={`/${lang}/request-quote`} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="relative overflow-hidden group w-full px-6 py-4 bg-vinex-teal text-white font-bold text-[11px] tracking-widest uppercase shadow-md">
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] animate-shine z-20" />
                  <span className="relative z-10 group-hover:text-vinex-gold transition-colors duration-300">{t.nav.cta}</span>
                  <span className="absolute inset-0 bg-vinex-charcoal transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useDict } from '@/hooks/useDict';

import { Glass, GlassButton } from '@/components/ui/glass';

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
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

  // Switch between languages
  const toggleLanguage = (targetLang: 'vi' | 'en') => {
    if (targetLang === lang) return;
    let newPath = pathname;
    if (pathname.startsWith(`/${lang}`)) {
      newPath = pathname.replace(`/${lang}`, `/${targetLang}`);
    } else {
      newPath = `/${targetLang}${pathname}`;
    }
    router.push(newPath);
  };

  // 6 Navigation Links matching standard enterprise information architecture
  const navItems = [
    { name: t.nav?.home || 'Trang chủ', href: `/${lang}`, exact: true },
    { name: t.nav?.about || (lang === 'en' ? 'About us' : 'Về chúng tôi'), href: `/${lang}/gioi-thieu` },
    { name: t.nav?.ecosystem || (lang === 'en' ? 'Ecosystem' : 'Hệ sinh thái'), href: `/${lang}#ecosystem` },
    {
      name: t.nav?.products || 'Sản phẩm',
      href: `/${lang}/san-pham`,
      hasDropdown: true,
      dropdown: [
        { name: t.nav?.products_cashew || 'Hạt điều tẩm vị', href: `/${lang}/san-pham?category=hat-dieu` },
        { name: t.nav?.products_tea || 'Trà & cà phê', href: `/${lang}/san-pham?category=tra-ca-phe` },
        { name: t.nav?.products_bakery || 'Bánh & kẹo', href: `/${lang}/san-pham?category=banh-keo` },
        { name: t.nav?.products_agri || 'Nông sản chế biến', href: `/${lang}/san-pham?category=nong-san` },
      ]
    },
    { name: t.nav?.projects || (lang === 'en' ? 'Projects' : 'Dự án'), href: `/${lang}/miss-world-2026` },
    { name: t.nav?.magazine || (lang === 'en' ? 'Magazine' : 'Tạp chí'), href: `/${lang}/kien-thuc` },
  ];

  const checkIsActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href || pathname === `${href}/`;
    }
    return pathname.startsWith(href) && href !== `/${lang}`;
  };

  // Header content rendered inside liquid glass
  const HeaderContent = (
    <div className="w-full h-full flex items-center justify-between">
      {/* 1. Logo */}
      <Link
        href={`/${lang}`}
        className="flex items-center flex-shrink-0 outline-none"
        aria-label="VINEX Home"
      >
        <div className="relative h-[38px] md:h-[42px] w-[100px] md:w-[115px]">
          <Image
            src={lang === 'en' ? "/images/logo_en.png" : "/images/logo.png"}
            alt="VINEX Logo"
            fill
            priority
            sizes="120px"
            className="object-contain object-left"
          />
        </div>
      </Link>

      {/* 2. Navigation Items (Active pill & Dropdown with pure smooth CSS glass) */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.href, item.exact);

          if (item.hasDropdown) {
            return (
              <div
                key={item.name}
                className="relative flex-shrink-0"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                {isActive ? (
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <Link
                      href={item.href}
                      className="px-4 py-1.5 rounded-[16px] bg-white/60 border border-white/60 text-[#074751] font-semibold text-[13.5px] xl:text-[14px] whitespace-nowrap select-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3.5 xl:px-4 py-1.5 rounded-[12px] text-[13.5px] xl:text-[14px] font-medium whitespace-nowrap select-none block transition-all duration-200 ${isProductsOpen
                      ? 'text-[#062c31] bg-white/30 shadow-xs'
                      : 'text-[#0c353b] hover:text-[#062c31] hover:bg-white/20'
                      }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu with smooth fade-slide transition & authentic Liquid Glass */}
                <div
                  className={`absolute top-full left-0 pt-2 z-50 w-64 pointer-events-auto transition-all duration-200 ease-out origin-top-left ${isProductsOpen
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                    }`}
                >
                  <div className="liquid-glass-dropdown relative w-full rounded-[12px] p-1.5 flex flex-col gap-0.5 overflow-hidden">
                    {/* Specular sheen reflection gradient overlay */}
                    <span
                      className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
                      aria-hidden="true"
                    />
                    {item.dropdown?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setIsProductsOpen(false)}
                        className="relative z-10 flex items-center justify-between px-3.5 py-2.5 rounded-[9px] text-[13.5px] font-medium text-[#074751] hover:bg-white/55 hover:border hover:border-white/60 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(7,71,81,0.06)] border border-transparent whitespace-nowrap transition-all duration-150 group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-150">{sub.name}</span>
                        <span className="text-[11px] text-vinex-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 font-bold">&rarr;</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return isActive ? (
            <div key={item.name} className="relative flex items-center justify-center flex-shrink-0">
              <Link
                href={item.href}
                className="px-4 py-1.5 rounded-[12px] bg-white/60 border border-white/60 text-[#074751] font-semibold text-[13.5px] xl:text-[14px] whitespace-nowrap select-none shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-200"
              >
                {item.name}
              </Link>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className="px-3.5 xl:px-4 py-1.5 rounded-[12px] text-[13.5px] xl:text-[14px] font-medium text-[#0c353b] hover:text-[#062c31] hover:bg-white/20 whitespace-nowrap select-none block transition-colors duration-200"
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. Actions: Language Switcher & Contact Button (Synchronized with GlassButton, radius 12px) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <GlassButton
          variant="secondary"
          size="sm"
          radius={12}
          leftIcon={<Globe className="w-3.5 h-3.5 text-[#074751]/80" strokeWidth={2} />}
          onClick={() => toggleLanguage(lang === 'vi' ? 'en' : 'vi')}
          className="text-[12.5px] px-3 py-1.5 font-semibold"
          aria-label="Switch Language"
        >
          <span className="uppercase tracking-wide">{lang}</span>
        </GlassButton>

        {/* CTA Contact Button */}
        <Link
          href={lang === 'en' ? `/${lang}/contact` : `/${lang}/lien-he`}
          className="hidden sm:inline-block"
        >
          <GlassButton
            variant="primary"
            size="sm"
            radius={12}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-[13px] px-4 py-2 font-medium"
          >
            {lang === 'en' ? 'Contact' : 'Liên hệ'}
          </GlassButton>
        </Link>

        {/* Mobile Menu Hamburger */}
        <GlassButton
          variant="secondary"
          size="sm"
          radius={12}
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 w-9 h-9 flex items-center justify-center"
          aria-label="Open Mobile Navigation"
        >
          <Menu className="w-4 h-4 text-[#074751]" />
        </GlassButton>
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Island Navigation Dock strictly matching Section Grid Width, radius 16px */}
      <header className="fixed top-2.5 sm:top-3.5 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 w-full">
          <div className="pointer-events-auto relative w-full h-[66px] md:h-[70px]">
            <Glass
              radius={16}
              displacementScale={40}
              blurAmount={0.5}
              saturation={140}
              aberrationIntensity={1.5}
              elasticity={0}
              padding="0"
              className="liquid-glass-header"
              style={{ width: '100%', height: '100%' }}
              fallback={
                <div className="liquid-glass-header w-full h-[66px] md:h-[70px] rounded-[16px] flex items-center justify-between px-4 md:px-6">
                  {HeaderContent}
                </div>
              }
            >
              {HeaderContent}
            </Glass>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (No animation, standard DOM) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 flex flex-col justify-end p-3">
          <div className="w-full max-h-[85vh] bg-white rounded-[16px] border border-white/80 shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Top */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div className="relative h-[36px] w-[100px]">
                <Image
                  src={lang === 'en' ? "/images/logo_en.png" : "/images/logo.png"}
                  alt="VINEX"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-black/5 text-[#074751]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="px-6 py-5 flex flex-col gap-2 overflow-y-auto flex-1">
              {navItems.map((item) => {
                const isActive = checkIsActive(item.href, item.exact);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-[15px] font-medium ${isActive
                      ? 'bg-[#074751] text-white font-semibold'
                      : 'text-[#0c353b] hover:bg-black/5'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Bottom Action */}
            <div className="p-5 border-t border-black/5 flex gap-3">
              <button
                onClick={() => {
                  toggleLanguage(lang === 'vi' ? 'en' : 'vi');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-black/5 text-[#074751] font-semibold text-[14px] flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-[#074751]/80" strokeWidth={2} />
                <span>{lang === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)'}</span>
              </button>
              <Link
                href={lang === 'en' ? `/${lang}/contact` : `/${lang}/lien-he`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#074751] text-white text-center font-medium text-[14px]"
              >
                {lang === 'en' ? 'Contact' : 'Liên hệ'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

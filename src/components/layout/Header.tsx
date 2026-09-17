"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useDict } from '@/hooks/useDict';

import { GlassButton, Glass, GlassCard } from '@/components/ui/glass';

export const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
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

  // 6 Navigation Links matching V2 Sitemap architecture
  const navItems = [
    { name: t.nav?.home || 'Trang chủ', href: `/${lang}`, exact: true },
    { name: t.nav?.about || 'Giới thiệu', href: `/${lang}/gioi-thieu` },
    {
      name: t.nav?.capability || 'Năng lực',
      href: `/${lang}/nha-may-boc-tach-dieu`,
      hasDropdown: true,
      dropdown: [
        { name: t.nav?.capability_story || 'Giới thiệu VINEX', href: `/${lang}/gioi-thieu` },
        { name: t.nav?.capability_factory || 'Nhà máy bóc tách điều', href: `/${lang}/nha-may-boc-tach-dieu` },
        { name: t.nav?.capability_cashew || 'Nhân điều trắng', href: `/${lang}/nhan-dieu-trang` },
      ]
    },
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
    { name: t.nav?.gifts || 'Quà tặng', href: `/${lang}/qua-tang-doanh-nghiep` },
    { name: t.nav?.news || 'Tin tức', href: `/${lang}/tin-tuc` },
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
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {isActive ? (
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <Link
                      href={item.href}
                      className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#074751] font-semibold text-[13.5px] xl:text-[14px] whitespace-nowrap select-none shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_12px_rgba(7,71,81,0.02)] flex items-center justify-center transition-all duration-200"
                    >
                      {item.name}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3.5 xl:px-4 py-1.5 rounded-full text-[13.5px] xl:text-[14px] font-medium whitespace-nowrap select-none block transition-all duration-200 ${activeDropdown === item.name
                      ? 'text-[#062c31] bg-white/30 shadow-xs'
                      : 'text-[#0c353b] hover:text-[#062c31] hover:bg-white/20'
                      }`}
                  >
                    {item.name}
                  </Link>
                )}

                <div
                  className={`absolute top-full left-0 pt-2 z-50 w-64 pointer-events-auto transition-all duration-200 ease-out origin-top-left ${activeDropdown === item.name
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                    }`}
                >
                  <Glass radius={12} className="w-full relative shadow-[0_8px_32px_rgba(7,71,81,0.04)] border border-white/80">
                    <div className="w-full rounded-[12px] p-1.5 flex flex-col gap-0.5 relative z-10 bg-white/40">
                      {/* Specular sheen reflection gradient overlay */}
                      <span
                        className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
                        aria-hidden="true"
                      />
                      {item.dropdown?.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setActiveDropdown(null)}
                          className="relative z-10 flex items-center justify-between px-3.5 py-2.5 rounded-[9px] text-[13.5px] font-medium text-[#074751] hover:bg-white/55 hover:border hover:border-white/60 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(7,71,81,0.06)] border border-transparent whitespace-nowrap transition-all duration-150 group"
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform duration-150">{sub.name}</span>
                          <span className="text-[11px] text-vinex-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 font-bold">&rarr;</span>
                        </Link>
                      ))}
                    </div>
                  </Glass>
                </div>
              </div>
            );
          }

          return isActive ? (
            <div key={item.name} className="relative flex items-center justify-center flex-shrink-0">
              <Link
                href={item.href}
                className="px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#074751] font-semibold text-[13.5px] xl:text-[14px] whitespace-nowrap select-none shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_2px_12px_rgba(7,71,81,0.08)] flex items-center justify-center transition-all duration-200"
              >
                {item.name}
              </Link>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className="px-3.5 xl:px-4 py-1.5 rounded-full text-[13.5px] xl:text-[14px] font-medium text-[#0c353b] hover:text-[#062c31] hover:bg-white/20 whitespace-nowrap select-none block transition-colors duration-200"
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
          leftIcon={<Globe className="w-3.5 h-3.5 text-[#074751]/80" strokeWidth={2} />}
          onClick={() => toggleLanguage(lang === 'vi' ? 'en' : 'vi')}
          className="text-[12.5px] px-3 py-1.5 font-semibold"
          aria-label="Switch Language"
        >
          <span className="uppercase tracking-wide">{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
        </GlassButton>

        {/* CTA Contact Button */}
        <Link
          href={lang === 'en' ? `/${lang}/contact` : `/${lang}/lien-he`}
          className="hidden sm:inline-block"
        >
          <GlassButton
            variant="primary"
            size="sm"
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
      <header className="fixed top-2.5 sm:top-3.5 left-0 right-0 z-[100] pointer-events-none">
        <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full">
          <div className="pointer-events-auto relative w-full h-[66px] md:h-[70px]">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
              <Glass radius={9999} className="w-full h-full relative border border-white/45 rounded-full shadow-[0_4px_24px_rgba(7,71,81,0.02)]">
                <div />
              </Glass>
            </div>

            {/* Foreground Content Layer */}
            <div className="absolute inset-0 z-10 px-4 md:px-6">
              {/* Specular sheen reflection gradient overlay */}
              <span
                className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/5 to-transparent pointer-events-none rounded-full"
                aria-hidden="true"
              />
              {HeaderContent}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Premium Right-Side Sliding Panel) */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[#074751]/20 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Right Side Drawer */}
        <div
          className={`absolute inset-y-0 right-0 w-[85vw] max-w-[380px] h-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="w-full h-full bg-[#FAF8F2]/90 backdrop-blur-3xl border-l border-white/60 flex flex-col shadow-[-10px_0_40px_rgba(7,71,81,0.15)] relative overflow-hidden">
            {/* Ambient Glass Reflections */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-vinex-gold/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#074751]/10 rounded-full blur-[100px] pointer-events-none" />

             {/* Drawer Header */}
             <div className="flex items-center justify-between px-6 py-6 border-b border-[#074751]/10 relative z-10">
                <div className="relative h-[34px] w-[95px]">
                  <Image
                    src={lang === 'en' ? "/images/logo_en.png" : "/images/logo.png"}
                    alt="VINEX"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-full bg-white/60 text-[#074751] hover:bg-white transition-colors border border-white/60 shadow-[0_2px_10px_rgba(7,71,81,0.05)]"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             {/* Drawer Links */}
             <div 
                className="px-7 py-8 flex flex-col gap-6 overflow-y-auto flex-1 hide-scrollbar relative z-10 overscroll-contain"
                data-lenis-prevent="true"
             >
                {navItems.map((item) => {
                  const isActive = checkIsActive(item.href, item.exact);

                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="flex flex-col group">
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-1 text-[22px] font-marcellus tracking-wide transition-colors ${isActive ? 'text-vinex-gold' : 'text-[#074751]'}`}
                        >
                          <span>{item.name}</span>
                        </Link>
                        <div className="flex flex-col pl-4 mt-3 gap-3 border-l-[1.5px] border-[#074751]/15">
                          {item.dropdown?.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-[15px] font-medium text-[#074751]/75 hover:text-[#074751] transition-colors py-1 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-vinex-gold/50"></span>
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.name} className="flex flex-col group">
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-1 text-[22px] font-marcellus tracking-wide transition-colors ${isActive ? 'text-vinex-gold' : 'text-[#074751]'}`}
                      >
                        <span>{item.name}</span>
                      </Link>
                    </div>
                  );
                })}
             </div>

             {/* Drawer Bottom Action */}
             <div className="px-6 py-4 border-t border-[#074751]/10 bg-white/50 relative z-10 flex flex-row items-center gap-3">
                <GlassButton
                  variant="secondary"
                  radius={9999}
                  leftIcon={<Globe className="w-4 h-4 text-[#074751]/80" strokeWidth={2} />}
                  onClick={() => {
                    toggleLanguage(lang === 'vi' ? 'en' : 'vi');
                    setIsMobileMenuOpen(false);
                  }}
                  className="!px-4 !h-[48px] flex-shrink-0 shadow-[0_4px_16px_rgba(7,71,81,0.02)] font-semibold"
                  aria-label="Switch Language"
                >
                  <span className="uppercase tracking-wide text-[14px] whitespace-nowrap">{lang}</span>
                </GlassButton>
                <Link
                  href={lang === 'en' ? `/${lang}/contact` : `/${lang}/lien-he`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex-1"
                >
                  <GlassButton
                    as="div"
                    variant="primary"
                    radius={9999}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full !h-[48px] shadow-[0_8px_20px_rgba(7,71,81,0.08)] font-semibold text-[14.5px] whitespace-nowrap"
                  >
                    {lang === 'en' ? 'Contact Us' : 'Liên hệ tư vấn'}
                  </GlassButton>
                </Link>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

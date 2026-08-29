"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useDict } from '@/hooks/useDict';

export const Footer = () => {
  const pathname = usePathname();
  const lang = pathname.startsWith('/en') ? 'en' : 'vi';
  const t = useDict();

  return (
    <footer className="bg-vinex-ivory text-vinex-charcoal pt-0 pb-8">
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-vinex-gold to-transparent opacity-50 mb-16"></div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 mb-12">
          
          {/* Brand Info (col 1-3) */}
          <div className="lg:col-span-3 lg:pr-4">
            <div className="mb-4">
              <Logo lang={lang as "vi" | "en"} />
            </div>
            <p className="text-vinex-charcoal/80 text-[13px] font-normal leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              {[
                { name: 'Facebook', d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { name: 'Instagram', d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { name: 'YouTube', d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                { name: 'LinkedIn', d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }
              ].map((social, idx) => (
                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-vinex-teal text-white flex items-center justify-center hover:bg-vinex-gold hover:text-vinex-teal transition-colors" aria-label={social.name}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={social.d}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* SẢN PHẨM (col 4-5) */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold text-vinex-teal uppercase mb-4">{t.footer.col_products}</h4>
            <div className="w-8 h-[1px] bg-vinex-gold mb-4"></div>
            <ul className="space-y-3.5 text-[13px] font-normal text-vinex-charcoal/80">
              {t.footer.links_products.map((link, idx) => (
                <li key={idx}>
                  <Link href={`/${lang}/collections`} className="flex items-center gap-1.5 hover:text-vinex-teal transition-colors group">
                    <ChevronRight className="w-3.5 h-3.5 text-vinex-gold group-hover:translate-x-0.5 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HỖ TRỢ (col 6-7) */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold text-vinex-teal uppercase mb-4">{t.footer.col_support}</h4>
            <div className="w-8 h-[1px] bg-vinex-gold mb-4"></div>
            <ul className="space-y-3.5 text-[13px] font-normal text-vinex-charcoal/80">
              {t.footer.links_support.map((link, idx) => (
                <li key={idx}>
                  <Link href={`/${lang}/support`} className="flex items-center gap-1.5 hover:text-vinex-teal transition-colors group">
                    <ChevronRight className="w-3.5 h-3.5 text-vinex-gold group-hover:translate-x-0.5 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* VỀ VINEX (col 8-9) */}
          <div className="lg:col-span-2">
            <h4 className="text-[13px] font-bold text-vinex-teal uppercase mb-4">{t.footer.col_about}</h4>
            <div className="w-8 h-[1px] bg-vinex-gold mb-4"></div>
            <ul className="space-y-3.5 text-[13px] font-normal text-vinex-charcoal/80">
              {t.footer.links_about.map((link, idx) => (
                <li key={idx}>
                  <Link href={`/${lang}/about`} className="flex items-center gap-1.5 hover:text-vinex-teal transition-colors group">
                    <ChevronRight className="w-3.5 h-3.5 text-vinex-gold group-hover:translate-x-0.5 transition-transform" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LIÊN HỆ (col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-[13px] font-bold text-vinex-teal uppercase mb-4">{t.footer.col_contact}</h4>
            <div className="w-8 h-[1px] bg-vinex-gold mb-4"></div>
            <ul className="space-y-4 text-[13px] text-vinex-charcoal/80">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2e9dc] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-vinex-gold" />
                </div>
                <div>
                  <div className="font-semibold">{t.footer.contact_phone}</div>
                  <div className="text-[11px] text-vinex-charcoal/60">{t.footer.contact_phone_sub}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2e9dc] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-vinex-gold" />
                </div>
                <div className="pt-1.5">{t.footer.contact_email}</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2e9dc] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-vinex-gold" />
                </div>
                <div className="pt-1.5 leading-snug pr-4">{t.footer.contact_address_1}</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f2e9dc] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-vinex-gold" />
                </div>
                <div className="pt-1.5 leading-snug pr-4">{t.footer.contact_address_2}</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-vinex-charcoal/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-vinex-charcoal/60">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <div className="flex items-center gap-6 text-[12px] text-vinex-charcoal/60">
            <Link href={`/${lang}/privacy`} className="hover:text-vinex-teal transition-colors">{t.footer.privacy}</Link>
            <Link href={`/${lang}/terms`} className="hover:text-vinex-teal transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

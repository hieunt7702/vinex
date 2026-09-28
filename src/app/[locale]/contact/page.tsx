import React from 'react';
import Link from 'next/link';
import { getPublicSettings, getPublicProducts } from '@/lib/dataService';
import { ContactForm } from '@/components/forms/ContactForm';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale === 'vi' ? 'vi' : 'en';
  const [settings, products] = await Promise.all([
    getPublicSettings(),
    getPublicProducts()
  ]);

  return (
    <main className="w-full flex flex-col min-h-screen pt-[100px] pb-24 relative overflow-hidden text-vinex-black">
      {/* Ambient Global Gradient for Liquid Glass Refraction */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#074751]/20 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-vinex-gold/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-[#5C7B6C]/20 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 w-full">
        {/* Header Section */}
        <div className="relative pt-6 pb-6 md:pb-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Link href={`/${lang}`} className="hover:text-[#074751] transition-colors">
              {lang === 'en' ? 'Home' : 'Trang chủ'}
            </Link>
            <span>/</span>
            <span className="text-[#074751] dark:text-teal-400 font-semibold">
              {lang === 'en' ? 'Contact' : 'Liên hệ'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-marcellus text-[#074751] dark:text-teal-200 tracking-tight mb-2.5">
            {lang === 'en' ? 'How can VINEX help you?' : 'VINEX có thể giúp gì cho bạn?'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light max-w-2xl leading-relaxed">
            {lang === 'en'
              ? 'Select your inquiry purpose and leave your details, we will get in touch shortly.'
              : 'Chọn nhu cầu và để lại thông tin, chúng tôi sẽ liên hệ hỗ trợ.'}
          </p>
        </div>

        {/* 3-Column Unified Contact Form */}
        <ContactForm sourceContext="Website - Trang Contact" initialSettings={settings} initialProducts={products} />
      </div>
    </main>
  );
}

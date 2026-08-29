import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  lang?: 'en' | 'vi';
  variant?: 'default' | 'small';
}

export const Logo: React.FC<LogoProps> = ({ className = '', lang = 'en', variant = 'default' }) => {
  return (
    <Link 
      href={`/${lang}`} 
      className={`inline-block focus:outline-none outline-none transition-all ${className}`}
      aria-label="VINEX Home"
    >
      <div className={`relative flex items-center ${variant === 'small' ? 'h-[36px]' : 'h-[48px] md:h-[64px]'}`}>
        <img 
          src={lang === 'en' ? "/images/logo_en.png" : "/images/logo.png"} 
          alt="VINEX Logo" 
          className="h-full w-auto object-contain object-left"
        />
      </div>
    </Link>
  );
};

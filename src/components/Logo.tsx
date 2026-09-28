import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  lang?: 'en' | 'vi';
  variant?: 'default' | 'small' | 'footer';
}

export const Logo: React.FC<LogoProps> = ({ className = '', lang = 'en', variant = 'default' }) => {
  const imgSrc = variant === 'footer'
    ? '/images/logo_footer.png'
    : (lang === 'en' ? '/images/logo_en.png' : '/images/logo.png');

  const heightClass = 
    variant === 'small'
      ? 'h-[36px]'
      : variant === 'footer'
      ? 'h-[56px] md:h-[68px]'
      : 'h-[48px] md:h-[64px]';

  return (
    <Link 
      href={`/${lang}`} 
      className={`inline-block focus:outline-none outline-none transition-all ${className}`}
      aria-label="VINEX Home"
    >
      <div className={`relative flex items-center ${heightClass}`}>
        <img 
          src={imgSrc} 
          alt="VINEX Logo" 
          className="h-full w-auto object-contain object-left"
        />
      </div>
    </Link>
  );
};

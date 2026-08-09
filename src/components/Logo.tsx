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
      /* Enforcing Clear Space: Margin and padding mathematically tied to the star height */
      className={`inline-block focus:outline-none outline-none transition-all ${className}`}
      aria-label="VINEX Home"
    >
      <div className={`relative flex items-center w-auto ${variant === 'small' ? 'h-[40px]' : 'h-[60px] md:h-[90px]'}`}>
        <img 
          src="/images/logo.png" 
          alt="VINEX Logo" 
          className={`h-full w-auto object-contain origin-left ${variant === 'small' ? 'scale-[2.4] translate-y-0' : 'scale-[1.6] md:scale-[1.8] translate-y-[6px]'}`}
        />
      </div>
    </Link>
  );
};

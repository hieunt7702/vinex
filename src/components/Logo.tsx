import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  lang?: 'en' | 'vi';
}

export const Logo: React.FC<LogoProps> = ({ className = '', lang = 'en' }) => {
  return (
    <Link 
      href="/" 
      /* Enforcing Clear Space: Margin and padding mathematically tied to the star height */
      className={`inline-block focus:outline-none focus:ring-2 focus:ring-vinex-yellow focus:ring-offset-2 focus:ring-offset-vinex-white rounded-sm transition-all ${className}`}
      aria-label="VINEX Home"
    >
      <div className="relative flex items-center h-[60px] md:h-[90px] w-auto">
        <img 
          src="/images/logo.png" 
          alt="VINEX Logo" 
          className="h-full w-auto object-contain origin-left scale-[1.6] md:scale-[1.8] translate-y-[6px]"
        />
      </div>
    </Link>
  );
};

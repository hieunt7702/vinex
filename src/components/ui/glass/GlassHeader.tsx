"use client";

import React from 'react';
import { Glass } from './Glass';

export interface GlassHeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  radius?: number;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  className?: string;
  maxWidth?: string;
  fixed?: boolean;
  fallback?: React.ReactNode;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  children,
  radius = 24,
  displacementScale = 25,
  blurAmount = 0.5,
  saturation = 160,
  aberrationIntensity = 1.5,
  className = '',
  maxWidth = 'max-w-[1536px]',
  fixed = true,
  fallback,
  style = {},
  ...props
}) => {
  return (
    <header
      className={`${fixed ? 'fixed top-2.5 sm:top-3.5 left-0 right-0 z-50 pointer-events-none' : 'relative w-full z-40'}`}
      {...props}
    >
      <div className={`${maxWidth} mx-auto px-4 md:px-8 xl:px-12 w-full`}>
        <div className="pointer-events-auto relative w-full h-[66px] md:h-[70px]">
          <Glass
            radius={radius}
            padding="0"
            className={`liquid-glass-header ${className}`}
            style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', ...style }}
            fallback={
              fallback || (
                <div className="liquid-glass-header w-full h-[66px] md:h-[70px] rounded-[24px] bg-white/25 backdrop-blur-2xl border border-white/60 shadow-lg flex items-center justify-between px-4 md:px-6">
                  {children}
                </div>
              )
            }
          >
            {children}
          </Glass>
        </div>
      </div>
    </header>
  );
};

export default GlassHeader;

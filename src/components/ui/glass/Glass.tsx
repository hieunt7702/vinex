"use client";

import React, { useState, useEffect } from 'react';

let CachedLiquidGlass: any = null;

// Preload module on client immediately without blocking initial render
if (typeof window !== 'undefined') {
  import('liquid-glass-react')
    .then((mod) => {
      CachedLiquidGlass = mod.default || mod;
    })
    .catch(() => {});
}

export interface GlassProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  padding?: string;
  overLight?: boolean;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Custom fallback element to display before hydration */
  fallback?: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({
  children,
  className = '',
  radius = 16,
  displacementScale = 40,
  blurAmount = 0.5,
  saturation = 140,
  aberrationIntensity = 1.5,
  elasticity = 0,
  padding = '0',
  overLight = false,
  mode = 'standard',
  style = {},
  onClick,
  fallback
}) => {
  // Always initialize to false and null so SSR and initial client hydration match 100%
  const [mounted, setMounted] = useState(false);
  const [LiquidComponent, setLiquidComponent] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (CachedLiquidGlass) {
      setLiquidComponent(() => CachedLiquidGlass);
    } else {
      import('liquid-glass-react')
        .then((mod) => {
          const comp = mod.default || mod;
          CachedLiquidGlass = comp;
          setLiquidComponent(() => comp);
        })
        .catch(() => {});
    }
  }, []);

  // Seamless instant CSS glass fallback (NEVER returns null, ZERO flicker, ZERO layout shift)
  if (!mounted || !LiquidComponent) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={`glass-wrapper relative ${className}`}
        style={{
          borderRadius: `${radius}px`,
          ...style
        }}
        onClick={onClick ? () => onClick({} as any) : undefined}
      >
        <span
          className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5 pointer-events-none rounded-[inherit]"
          aria-hidden="true"
        />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-wrapper relative ${className}`}
      style={{
        borderRadius: `${radius}px`,
        ...style
      }}
      onClick={onClick}
    >
      <LiquidComponent
        cornerRadius={radius}
        displacementScale={displacementScale}
        blurAmount={blurAmount}
        saturation={saturation}
        aberrationIntensity={aberrationIntensity}
        elasticity={elasticity}
        padding={padding}
        overLight={overLight}
        mode={mode}
        className="glass-container w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </LiquidComponent>
    </div>
  );
};

export default Glass;

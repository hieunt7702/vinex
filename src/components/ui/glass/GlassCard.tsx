"use client";

import React from 'react';
import { Glass } from './Glass';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  overLight?: boolean;
  mode?: 'standard' | 'polar' | 'prominent' | 'shader';
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  size = 'md',
  radius = 16,
  displacementScale = 40,
  blurAmount = 0.5,
  saturation = 140,
  aberrationIntensity = 1.5,
  elasticity = 0,
  overLight = false,
  mode = 'standard',
  children,
  className = '',
  contentClassName,
  style = {},
  ...props
}) => {
  const defaultRadius = radius ?? 16;

  const variantStyles = {
    default: 'text-[#0c353b]',
    elevated: 'text-[#0c353b]',
    interactive: 'cursor-pointer hover:scale-[1.01] transition-all duration-300 text-[#0c353b]',
    teal: 'text-white',
  };

  return (
    <Glass
      radius={defaultRadius}
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      overLight={overLight}
      mode={mode}
      className={`glass-card ${variantStyles[variant]} ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
      {...props}
    >
      <div className={`w-full h-full relative ${contentClassName || 'flex flex-col'}`}>
        {children}
      </div>
    </Glass>
  );
};


export const GlassCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const GlassCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-xl font-semibold tracking-tight text-inherit ${className}`} {...props}>
    {children}
  </h3>
);

export const GlassCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-sm opacity-70 ${className}`} {...props}>
    {children}
  </p>
);

export const GlassCardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex-1 ${className}`} {...props}>
    {children}
  </div>
);

export const GlassCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10 ${className}`} {...props}>
    {children}
  </div>
);

export default GlassCard;

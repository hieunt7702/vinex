"use client";

import React from 'react';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  overLight?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  radius,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled = false,
  overLight = false,
  type = 'button',
  onClick,
  ...props
}) => {
  // Default radius 12px for buttons
  const defaultRadius = radius ?? 12;

  // Size padding and typography
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-[13.5px] gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
  };

  const gapClasses = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2.5',
  };

  // Variant styles adhering to guide section 3 & 11 with authentic liquid glass refraction & specular highlights
  const variantStyles = {
    primary:
      'bg-[#0D5962]/85 hover:bg-[#0D5962]/95 backdrop-blur-md text-white border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_8px_25px_rgba(13,89,98,0.25)]',
    secondary:
      'bg-white/45 hover:bg-white/60 backdrop-blur-md text-[#074751] border border-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),0_4px_16px_rgba(0,0,0,0.06)]',
    gold:
      'bg-[#F2B719]/85 hover:bg-[#F2B719]/95 backdrop-blur-md text-[#24313A] border border-white/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_8px_25px_rgba(242,183,25,0.22)]',
    ghost:
      'bg-transparent hover:bg-white/20 backdrop-blur-sm text-[#074751] border border-white/30',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-medium whitespace-nowrap select-none overflow-hidden transition-all duration-200 outline-none
        ${sizeClasses[size]}
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
        ${className}
      `}
      style={{
        borderRadius: `${defaultRadius}px`,
      }}
      {...props}
    >
      {/* Specular sheen reflection gradient overlay */}
      <span
        className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/5 pointer-events-none rounded-[inherit]"
        aria-hidden="true"
      />

      <span className={`relative z-10 flex items-center ${gapClasses[size]}`}>
        {leftIcon && <span className="flex-shrink-0 flex items-center justify-center">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="flex-shrink-0 flex items-center justify-center">{rightIcon}</span>}
      </span>
    </button>
  );
};

export default GlassButton;


"use client";

import React, { forwardRef } from 'react';
import { Glass } from './Glass';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  radius?: number;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  radius = 12,
  className = '',
  id,
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[#0c353b] select-none"
        >
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center w-full transition-all duration-200 border
          ${error ? 'border-red-400 focus-within:border-red-500' : 'border-white/30 focus-within:border-[#0D5962]/70 focus-within:ring-2 focus-within:ring-[#0D5962]/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-white/[0.12] hover:bg-white/[0.18]'}
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        `}
        style={{ borderRadius: `${radius}px` }}
      >
        <Glass
          radius={radius}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <div className="opacity-0 w-full h-full" />
        </Glass>

        <div className="relative z-10 flex items-center w-full px-3.5 py-2.5">
          {leftIcon && <span className="mr-2.5 text-[#074751]/60 flex-shrink-0">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-transparent text-[#074751] placeholder-[#074751]/45 text-sm outline-none font-medium ${className}`}
            {...props}
          />
          {rightIcon && <span className="ml-2.5 text-[#074751]/60 flex-shrink-0">{rightIcon}</span>}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#0c353b]/60 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

export interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  radius?: number;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(({
  label,
  error,
  helperText,
  radius = 12,
  className = '',
  id,
  disabled = false,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-[#0c353b] select-none"
        >
          {label}
        </label>
      )}

      <div
        className={`relative w-full transition-all duration-200 border
          ${error ? 'border-red-400 focus-within:border-red-500' : 'border-white/30 focus-within:border-[#0D5962]/70 focus-within:ring-2 focus-within:ring-[#0D5962]/20'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-white/[0.12] hover:bg-white/[0.18]'}
          shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        `}
        style={{ borderRadius: `${radius}px` }}
      >
        <Glass
          radius={radius}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <div className="opacity-0 w-full h-full" />
        </Glass>

        <div className="relative z-10 p-3.5">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            className={`w-full bg-transparent text-[#074751] placeholder-[#074751]/45 text-sm outline-none font-medium resize-y ${className}`}
            {...props}
          />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#0c353b]/60 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

GlassTextarea.displayName = 'GlassTextarea';

export default GlassInput;

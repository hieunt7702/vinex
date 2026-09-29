"use client";

import React from 'react';
import { Package, Coffee, Leaf, Sparkles, Cookie, Layers } from 'lucide-react';

interface ProductImageFallbackProps {
  name?: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg' | 'fill';
  className?: string;
}

export function ProductImageFallback({
  name = '',
  category = '',
  size = 'fill',
  className = '',
}: ProductImageFallbackProps) {
  const catLower = (category || name || '').toLowerCase();

  let IconComponent = Package;
  let categoryLabel = category || 'Nông sản VINEX';

  if (catLower.includes('trà') || catLower.includes('tea')) {
    IconComponent = Leaf;
  } else if (catLower.includes('cafe') || catLower.includes('cà phê') || catLower.includes('coffee')) {
    IconComponent = Coffee;
  } else if (catLower.includes('hạt') || catLower.includes('nut') || catLower.includes('điều') || catLower.includes('hạnh nhân')) {
    IconComponent = Sparkles;
  } else if (catLower.includes('bánh') || catLower.includes('kẹo') || catLower.includes('biscuit') || catLower.includes('snack') || catLower.includes('cacao')) {
    IconComponent = Cookie;
  } else if (catLower.includes('sấy') || catLower.includes('mứt')) {
    IconComponent = Layers;
  }

  if (size === 'sm') {
    return (
      <div className={`w-full h-full min-h-[40px] bg-[#f0f4f3] dark:bg-[#1a2325] border border-[#074751]/10 flex items-center justify-center text-[#074751] dark:text-teal-300 rounded-[4px] select-none ${className}`}>
        <IconComponent className="w-5 h-5 opacity-70" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[180px] relative flex flex-col items-center justify-center bg-[#f4f7f6] dark:bg-[#111c1e] text-[#074751] dark:text-teal-200 select-none overflow-hidden transition-colors ${className}`}>
      {/* Faint elegant brand watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.06]">
        <span className="text-[100px] sm:text-[140px] font-bold font-serif tracking-widest text-[#074751]">VINEX</span>
      </div>

      {/* Center Icon badge */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-[#1a292c] shadow-[0_8px_24px_rgba(7,71,81,0.06),inset_0_1px_1.5px_rgba(255,255,255,0.9)] border border-[#074751]/10 dark:border-teal-700/20 flex items-center justify-center text-[#074751] dark:text-teal-300 transition-transform duration-300 group-hover:scale-105">
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.6]" />
        </div>

        <span className="mt-3 text-[11px] font-semibold tracking-wider uppercase text-[#074751]/60 dark:text-teal-200/60">
          {categoryLabel}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-light mt-0.5">
          Sản phẩm chính hãng VINEX
        </span>
      </div>
    </div>
  );
}

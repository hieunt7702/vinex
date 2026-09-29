"use client";

import React from 'react';
import { Package } from 'lucide-react';

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
  const categoryLabel = category || 'Sản phẩm VINEX';

  if (size === 'sm') {
    return (
      <div className={`w-full h-full min-h-[40px] bg-[#f4f7f6] dark:bg-[#1a2325] border border-gray-200/60 dark:border-gray-800 flex items-center justify-center text-[#074751]/60 dark:text-teal-300/70 select-none ${className}`}>
        <Package className="w-4 h-4 stroke-[1.2]" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[160px] relative flex flex-col items-center justify-center bg-[#f5f7f6] dark:bg-[#111c1e] text-[#074751] select-none transition-colors ${className}`}>
      {/* Center Product Icon Box - Flat, No Shadow, Light & Refined Stroke */}
      <div className="flex flex-col items-center justify-center p-3 text-center">
        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#182528] border border-gray-200/70 dark:border-teal-900/30 flex items-center justify-center text-[#074751]/75 dark:text-teal-300/80">
          <Package className="w-6 h-6 stroke-[1.2]" />
        </div>

        <span className="mt-2.5 text-[11px] font-medium tracking-wide text-[#074751]/60 dark:text-teal-200/60 line-clamp-1">
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}

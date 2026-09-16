"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Glass } from './Glass';

export interface DropdownItem {
  label: string;
  value?: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}

export interface GlassDropdownProps {
  label?: string;
  trigger?: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  openMode?: 'click' | 'hover';
  align?: 'left' | 'right' | 'center';
  width?: string;
  radius?: number;
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  label = 'Select',
  trigger,
  items,
  children,
  openMode = 'click',
  align = 'left',
  width = 'w-56',
  radius = 16,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (openMode !== 'click' || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, openMode]);

  const handleMouseEnter = () => {
    if (openMode === 'hover') setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (openMode === 'hover') setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (openMode === 'click') setIsOpen((prev) => !prev);
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      {trigger ? (
        <div onClick={toggleDropdown} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-[#074751] text-sm font-medium transition-all shadow-sm outline-none"
        >
          <span>{label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full pt-2 z-50 ${width} ${alignClasses[align]} pointer-events-auto`}
        >
          <div className="liquid-glass-dropdown relative w-full rounded-[14px] p-1.5 flex flex-col gap-0.5 overflow-hidden">
            {/* Specular sheen reflection gradient overlay */}
            <span
              className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent pointer-events-none rounded-[inherit]"
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-0.5 w-full text-[#074751]">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const content = (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[11px] text-vinex-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 font-bold">&rarr;</span>
                    </div>
                  );

                  const itemClasses = `group flex items-center px-3.5 py-2.5 rounded-[9px] text-[13.5px] font-medium transition-all duration-150 whitespace-nowrap ${
                    item.active
                      ? 'bg-[#074751] text-white font-semibold shadow-xs'
                      : 'text-[#074751] hover:bg-white/60 hover:border hover:border-white/60 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(7,71,81,0.06)] border border-transparent'
                  }`;

                  if (item.href) {
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          setIsOpen(false);
                        }}
                        className={itemClasses}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (item.onClick) item.onClick();
                        setIsOpen(false);
                      }}
                      className={`w-full text-left ${itemClasses}`}
                    >
                      {content}
                    </button>
                  );
                })
              ) : (
                children
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlassDropdown;

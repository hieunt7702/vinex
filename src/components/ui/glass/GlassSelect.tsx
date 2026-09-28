"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface GlassSelectOption {
  label: string;
  value: string;
}

export interface GlassSelectProps {
  options: GlassSelectOption[];
  placeholder?: string;
  className?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  options,
  placeholder = "Chọn tùy chọn...",
  className = "",
  name,
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue) ||
    options.find((opt) => opt.value && currentValue && opt.value.trim().toLowerCase() === currentValue.trim().toLowerCase());

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check positioning (upwards vs downwards) when opening
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 260 && rect.top > 200) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (val: string) => {
    if (disabled) return;
    setInternalValue(val);
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  // Scroll active item into view when opened
  useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        (selectedEl as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen]);

  const hasValue = Boolean(currentValue);
  const displayLabel = selectedOption ? selectedOption.label : (hasValue ? currentValue : placeholder);
  const isLabelActive = Boolean(selectedOption || hasValue);

  return (
    <div ref={containerRef} className={`relative w-full ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={currentValue} />}
      
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-[#074751]/60 focus:border-[#074751] rounded-xl px-4 py-3 text-left text-sm transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#074751]/20 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${isOpen ? 'border-[#074751] ring-2 ring-[#074751]/20 bg-white dark:bg-gray-900' : ''}`}
      >
        <span className={`truncate ${isLabelActive ? "text-gray-900 dark:text-white font-medium" : "text-gray-400 dark:text-gray-500 font-normal"}`}>
          {displayLabel}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-[#074751]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          data-lenis-prevent="true"
          onWheel={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
          className={`absolute z-[9999] min-w-full min-w-[140px] w-auto max-w-[min(100vw-32px,380px)] ${
            openUpwards ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-0 p-1.5 bg-white/95 dark:bg-[#111922]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(7,71,81,0.18),inset_0_1px_2px_rgba(255,255,255,0.9)] max-h-60 overflow-y-auto animate-in fade-in ${
            openUpwards ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'
          } duration-150 glass-scrollbar`}
          style={{
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {options.length === 0 ? (
            <div className="py-4 px-3 text-center text-xs text-gray-400">
              Không có tùy chọn
            </div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === currentValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-[13px] transition-colors cursor-pointer rounded-xl ${
                    isSelected
                      ? 'bg-[#074751]/10 dark:bg-teal-950/50 text-[#074751] dark:text-teal-300 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-[#074751]/6 dark:hover:bg-white/5 hover:text-[#074751] dark:hover:text-teal-300 font-normal'
                  }`}
                >
                  <span className="truncate pr-2">{option.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#074751] dark:text-teal-400 shrink-0 ml-1.5" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GlassSelect;

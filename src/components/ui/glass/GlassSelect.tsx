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
  placeholder = "Chọn nhu cầu...",
  className = "",
  name,
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);

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

  const handleSelect = (val: string) => {
    if (disabled) return;
    setInternalValue(val);
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={currentValue} />}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white/60 hover:bg-white/75 backdrop-blur-md border border-white/50 rounded-xl px-5 py-3.5 text-left text-sm transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_8px_rgba(7,71,81,0.04)] focus:outline-none focus:border-vinex-teal focus:ring-2 focus:ring-vinex-teal/15 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={`truncate font-normal ${selectedOption ? "text-vinex-charcoal" : "text-vinex-charcoal/40"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-vinex-charcoal/60 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-1.5 bg-white/95 backdrop-blur-2xl border border-white/70 rounded-xl shadow-[0_12px_40px_rgba(7,71,81,0.16)] max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 custom-scrollbar">
          {options.map((option) => {
            const isSelected = option.value === currentValue;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#074751]/10 text-[#074751] font-semibold'
                    : 'text-vinex-charcoal hover:bg-[#074751]/5 hover:text-[#074751]'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#074751] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GlassSelect;

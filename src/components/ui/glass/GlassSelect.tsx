"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface GlassSelectOption {
  label: string;
  value: string;
}

export interface GlassSelectProps {
  options: GlassSelectOption[];
  placeholder?: string;
  className?: string;
  name?: string;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  options,
  placeholder = "Chọn...",
  className = "",
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

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

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={selectedValue} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/60 backdrop-blur-md border border-white/40 rounded-xl px-5 py-4 text-left focus:outline-none focus:border-vinex-teal/50 focus:bg-white/80 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
      >
        <span className={selectedOption ? "text-vinex-charcoal" : "text-vinex-charcoal/40"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-vinex-charcoal/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-white/80 backdrop-blur-xl border border-white/40 rounded-xl shadow-[0_8px_32px_rgba(7,71,81,0.12)] max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelectedValue(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 transition-colors ${
                option.value === selectedValue
                  ? 'bg-vinex-teal/10 text-vinex-teal font-medium'
                  : 'text-vinex-charcoal hover:bg-vinex-teal/5'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

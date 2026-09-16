"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Glass } from './Glass';

export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  radius?: number;
  maxWidth?: string;
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  radius = 24,
  maxWidth = 'max-w-lg',
  className = ''
}) => {
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className={`relative z-10 w-full ${maxWidth} ${className}`}>
        <Glass
          radius={radius}
          className="w-full shadow-2xl border border-white/30 overflow-hidden"
        >
          <div className="p-6 md:p-8 flex flex-col gap-5 text-[#074751] bg-white/40">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              {title && <h3 className="text-xl tracking-tight font-semibold">{title}</h3>}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/10 transition-colors ml-auto text-[#074751]"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto max-h-[70vh]">
              {children}
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
};

export default GlassModal;

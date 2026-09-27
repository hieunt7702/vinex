"use client";

import React, { useState, useEffect, useRef } from 'react';

export function formatNumberVN(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'number' ? val : parseInt(val.toString().replace(/\D/g, ''), 10);
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseNumberVN(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | undefined | null;
  onChange: (val: number) => void;
  suffix?: string;
  allowZero?: boolean;
  wrapperClassName?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  suffix,
  allowZero = true,
  className = '',
  wrapperClassName = '',
  placeholder = '0',
  onBlur,
  onFocus,
  onKeyDown,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const getFormattedString = (v: number | undefined | null) => {
    if (v === undefined || v === null) return '';
    if (v === 0) return allowZero ? '0' : '';
    return formatNumberVN(v);
  };

  const [displayValue, setDisplayValue] = useState<string>(() => getFormattedString(value));

  // Sync from props when value changes externally
  useEffect(() => {
    const currentParsed = parseNumberVN(displayValue);
    const targetVal = value ?? 0;
    
    // Only update if there's a genuine mismatch or when not focused
    if (!isFocused) {
      setDisplayValue(getFormattedString(value));
    } else if (currentParsed !== targetVal && displayValue !== '') {
      setDisplayValue(formatNumberVN(targetVal));
    }
  }, [value, allowZero, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const raw = input.value;
    const cursor = input.selectionStart || 0;

    // Count how many actual numeric digits were before the cursor
    const digitsBeforeCursor = raw.slice(0, cursor).replace(/\D/g, '').length;

    if (!raw.trim()) {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numericValue = parseNumberVN(raw);
    const formatted = formatNumberVN(numericValue);
    setDisplayValue(formatted);
    onChange(numericValue);

    // Keep cursor position stable across dot insertions
    requestAnimationFrame(() => {
      if (!inputRef.current) return;
      let targetCursor = 0;
      let digitsCount = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          digitsCount++;
        }
        if (digitsCount >= digitsBeforeCursor) {
          targetCursor = i + 1;
          break;
        }
      }
      if (digitsBeforeCursor === 0) targetCursor = 0;
      inputRef.current.setSelectionRange(targetCursor, targetCursor);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      // If cursor is right after a dot and user hits backspace, skip over and delete the digit before the dot
      if (start === end && start > 1 && input.value[start - 1] === '.') {
        e.preventDefault();
        const raw = input.value;
        const newRaw = raw.slice(0, start - 2) + raw.slice(start);
        const num = parseNumberVN(newRaw);
        const fmt = formatNumberVN(num);
        setDisplayValue(fmt);
        onChange(num);

        requestAnimationFrame(() => {
          if (!inputRef.current) return;
          const newPos = Math.max(0, start - 2);
          inputRef.current.setSelectionRange(newPos, newPos);
        });
        return;
      }
    }
    onKeyDown?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // If value is 0, selecting all or clearing can make it faster to type
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (displayValue === '' && allowZero) {
      setDisplayValue('0');
      onChange(0);
    } else {
      setDisplayValue(getFormattedString(value));
    }
    onBlur?.(e);
  };

  return (
    <div className={`relative w-full flex items-center ${wrapperClassName}`}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${className} ${suffix ? 'pr-14' : ''}`}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3 text-xs font-semibold text-gray-400 dark:text-gray-500 pointer-events-none select-none uppercase tracking-wide">
          {suffix}
        </span>
      )}
    </div>
  );
};

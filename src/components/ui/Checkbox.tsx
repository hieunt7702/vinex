import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="group flex items-center gap-3 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={cn(
            "w-5 h-5 rounded-[4px] border border-gray-300 bg-white transition-all duration-300",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-vinex-teal/30",
            "group-hover:border-vinex-teal/50",
            "peer-checked:border-transparent peer-checked:bg-gradient-to-tr peer-checked:from-vinex-teal peer-checked:to-[#117682]",
            "peer-checked:shadow-[0_2px_8px_rgba(13,89,98,0.25)]",
            className
          )}>
            <Check 
              className={cn(
                "w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "opacity-0 scale-50 transition-all duration-300 ease-out",
                "peer-checked:opacity-100 peer-checked:scale-100"
              )}
              strokeWidth={3.5}
            />
          </div>
        </div>
        {label && (
          <span className="text-sm text-gray-600 group-hover:text-vinex-teal transition-colors select-none">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

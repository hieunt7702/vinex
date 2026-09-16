import React from 'react';
import { Check } from 'lucide-react';

interface GlassCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  labelClassName?: string;
}

export const GlassCheckbox = React.forwardRef<HTMLInputElement, GlassCheckboxProps>(
  ({ className = '', label, labelClassName = '', ...props }, ref) => {
    return (
      <label className="group flex items-start gap-3 cursor-pointer">
        <div className="relative flex items-center justify-center shrink-0 mt-[1px]">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={`
            w-5 h-5 rounded-[6px] border border-white/40 bg-white/40 backdrop-blur-md transition-all duration-300
            peer-focus-visible:ring-2 peer-focus-visible:ring-vinex-teal/30
            group-hover:bg-white/60 group-hover:border-white/60
            peer-checked:border-vinex-teal/50 peer-checked:bg-vinex-teal/20
            peer-checked:shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]
            ${className}
          `}>
            <Check 
              className={`
                w-3.5 h-3.5 text-vinex-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                opacity-0 scale-50 transition-all duration-300 ease-out
                peer-checked:opacity-100 peer-checked:scale-100
              `}
              strokeWidth={3}
            />
          </div>
        </div>
        {label && (
          <span className={`text-[13px] text-vinex-charcoal/70 font-light leading-relaxed select-none group-hover:text-vinex-teal transition-colors ${labelClassName}`}>
            {label}
          </span>
        )}
      </label>
    );
  }
);
GlassCheckbox.displayName = 'GlassCheckbox';

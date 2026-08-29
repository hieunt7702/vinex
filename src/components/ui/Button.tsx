import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className = '', ...props }) => {
  const baseClasses = "relative overflow-hidden group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-[11px] md:text-xs tracking-widest uppercase transition-all duration-300 rounded-none whitespace-nowrap";
  
  const variants = {
    primary: "bg-gradient-to-r from-vinex-teal to-[#117682] text-white shadow-[0_0_15px_rgba(13,89,98,0.3)] hover:shadow-[0_0_20px_rgba(13,89,98,0.5)] border border-transparent",
    secondary: "bg-transparent border border-vinex-teal text-vinex-teal hover:text-white",
    gold: "bg-gradient-to-r from-vinex-gold to-[#dcb419] text-vinex-charcoal shadow-[0_0_15px_rgba(242,183,25,0.3)] hover:shadow-[0_0_20px_rgba(242,183,25,0.5)] border border-transparent"
  };

  const hoverBg = {
    primary: "bg-gradient-to-r from-vinex-charcoal to-[#334654]",
    secondary: "bg-gradient-to-r from-vinex-teal to-[#117682]",
    gold: "bg-white"
  };

  const textHover = {
    primary: "group-hover:text-vinex-gold",
    secondary: "group-hover:text-white",
    gold: "group-hover:text-vinex-teal"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {/* Shine Effect */}
      <span className="absolute top-0 left-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] animate-shine z-20 pointer-events-none" />
      
      {/* Text Content */}
      <span className={`relative z-10 transition-colors duration-300 ${textHover[variant]}`}>
        {children}
      </span>
      
      {/* Hover Background Expansion */}
      <span className={`absolute inset-0 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 ${hoverBg[variant]}`} />
    </button>
  );
};

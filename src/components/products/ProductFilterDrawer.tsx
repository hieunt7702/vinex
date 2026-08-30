"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ProductFilterDrawer({ 
  children,
  searchQuery,
  onSearchChange,
  onClear,
  onApply
}: { 
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onClear?: () => void;
  onApply?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Trigger Button & Search */}
      <div className="lg:hidden mb-8 flex justify-between items-center bg-white p-2.5 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#E8E4D9]/60 gap-3">
        <div className="flex-1 relative flex items-center group">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 group-focus-within:text-vinex-teal transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="Tìm tên sản phẩm..." 
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F2] border border-transparent focus:border-vinex-teal/30 focus:bg-white focus:ring-4 focus:ring-vinex-teal/10 rounded-sm text-sm outline-none transition-all duration-300 placeholder:text-gray-400 text-vinex-black"
          />
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-vinex-teal text-white px-5 py-2.5 rounded-sm text-sm font-bold tracking-wide shrink-0 shadow-md shadow-vinex-teal/10 hover:shadow-lg hover:shadow-vinex-teal/20 hover:-translate-y-0.5 hover:bg-[#115a56] active:scale-95 transition-all duration-300"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Bộ lọc
        </button>
      </div>

      {/* Desktop Filter / Modal Filter wrapper */}
      <div className={`
        fixed inset-0 z-50 flex lg:static lg:block lg:w-[240px] lg:shrink-0 lg:sticky lg:top-32 lg:h-fit
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
        transition-opacity duration-300
      `}>
        {/* Overlay (Mobile/Tablet only) */}
        <div 
          className="absolute inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Content */}
        <aside className={`
          absolute top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col overflow-hidden
          transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:static lg:h-auto lg:w-full lg:max-w-none lg:bg-transparent lg:shadow-none lg:overflow-visible
        `}>
          {/* Header Mobile */}
          <div className="flex justify-between items-center p-6 pb-4 lg:hidden shrink-0 border-b border-gray-100">
            <h3 className="font-bold text-lg uppercase tracking-widest text-vinex-teal">Bộ lọc</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 hover:text-vinex-black transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Children is the filter form */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-0 custom-scrollbar">
             {children}
          </div>

          {/* Action buttons (Mobile only for now) */}
          <div className="p-6 pt-4 border-t border-gray-100 flex gap-4 lg:hidden shrink-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-10 relative">
            <button 
               onClick={() => {
                 onClear?.();
                 setIsOpen(false);
               }}
               className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
               Xóa
            </button>
            <Button 
               variant="primary"
               onClick={() => {
                 onApply?.();
                 setIsOpen(false);
               }}
               className="flex-1 !px-2 !py-3 shadow-md shadow-vinex-teal/20"
            >
               Áp dụng
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}

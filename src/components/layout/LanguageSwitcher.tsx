"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split("/")[1] || "vi";

  const toggleLanguage = () => {
    const newLocale = currentLocale === "en" ? "vi" : "en";
    let newPath = pathname;
    
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }
    
    router.push(newPath);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-vinex-black/70 hover:text-vinex-blue transition-colors uppercase tracking-widest rounded-full hover:bg-gray-50"
      aria-label="Switch Language"
    >
      <Globe className="w-4 h-4" />
      <span>{currentLocale === "en" ? "EN" : "VI"}</span>
    </button>
  );
};

"use client";

import { usePathname, useRouter } from "next/navigation";

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
      className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-vinex-black border-2 border-vinex-yellow text-vinex-yellow font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,199,3,0.3)] flex items-center justify-center hover:scale-110 hover:bg-vinex-yellow hover:text-vinex-black transition-all"
    >
      {currentLocale === "en" ? "VI" : "EN"}
    </button>
  );
};

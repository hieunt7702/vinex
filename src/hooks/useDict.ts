'use client';

import { usePathname } from 'next/navigation';
import { getDictionary } from '@/dictionaries';

/**
 * Hook tập trung để lấy dictionary theo locale hiện tại.
 * Tự động phát hiện ngôn ngữ từ URL pathname.
 * 
 * Usage: const t = useDict();
 *        <h1>{t.hero.title1}</h1>
 */
export const useDict = () => {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'vi';
  return getDictionary(locale);
};

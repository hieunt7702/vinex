import en from './en.json';
import vi from './vi.json';

export type Locale = 'en' | 'vi';

export const getDictionary = (locale: Locale) => {
  return locale === 'en' ? en : vi;
};

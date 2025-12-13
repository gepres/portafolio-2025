import { useTranslation } from 'react-i18next';

export interface BilingualText {
  es: string;
  en: string;
}

/**
 * Hook to get localized text from BilingualText object or string
 * @param text - BilingualText object or plain string
 * @returns Localized string based on current language
 */
export const useLocalizedText = (text: BilingualText | string | undefined): string => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'es' | 'en';
  
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  return text[currentLang] || text.es || text.en || '';
};

/**
 * Get localized text without hook (for use outside components)
 * @param text - BilingualText object or plain string
 * @param lang - Language code ('es' or 'en')
 * @returns Localized string
 */
export const getLocalizedText = (
  text: BilingualText | string | undefined,
  lang: 'es' | 'en' = 'es'
): string => {
  if (!text) return '';
  if (typeof text === 'string') return text;
  
  return text[lang] || text.es || text.en || '';
};

/**
 * Check if text is bilingual
 * @param text - Text to check
 * @returns True if text is BilingualText object
 */
export const isBilingualText = (text: any): text is BilingualText => {
  return text && typeof text === 'object' && 'es' in text && 'en' in text;
};

/**
 * Create empty bilingual text object
 * @returns Empty BilingualText object
 */
export const createEmptyBilingualText = (): BilingualText => ({
  es: '',
  en: ''
});

/**
 * Convert string to BilingualText (both languages same)
 * @param text - String to convert
 * @returns BilingualText object
 */
export const stringToBilingualText = (text: string): BilingualText => ({
  es: text,
  en: text
});

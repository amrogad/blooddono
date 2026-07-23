import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';

export const LOCALES = ['en', 'ar'];
export const LOCALE_STORAGE_KEY = 'app-locale';

// Read the saved language synchronously so the very first render is already in
// the right language — no flash of English before LocaleProvider mounts.
function initialLng() {
  if (typeof localStorage === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    // storage unavailable — fall back to English
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: initialLng(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    // `{{value, iso}}` wraps a dynamic value in Unicode isolates so Latin tokens
    // (blood groups like A+, place names, amounts, times) don't visually reorder
    // when embedded in an Arabic sentence. No-op in LTR.
    format: (value, format) => (format === 'iso' ? `⁨${value}⁩` : value),
  },
  react: { useSuspense: false },
  returnNull: false,
});

export default i18n;

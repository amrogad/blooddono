import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import i18n, { LOCALE_STORAGE_KEY } from '../i18n';

const LocaleContext = createContext(undefined);

function getInitialLocale() {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === 'ar' ? 'ar' : 'en';
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    if (i18n.language !== locale) i18n.changeLanguage(locale);
  }, [locale]);

  const setLocale = useCallback((next) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode) — language still works for the session
    }
  }, []);

  const toggle = useCallback(() => setLocale(locale === 'ar' ? 'en' : 'ar'), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={{ locale, isRTL: locale === 'ar', setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

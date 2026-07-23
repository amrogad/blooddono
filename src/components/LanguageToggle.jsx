import { useLocale } from '../providers/LocaleProvider';

export default function LanguageToggle({ className = '' }) {
  const { locale, toggle } = useLocale();
  const arabic = locale === 'ar';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={arabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-sm font-semibold text-body transition hover:text-ink ${className}`}
    >
      {arabic ? 'EN' : 'ع'}
    </button>
  );
}

import { LuSun, LuMoon } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeProvider';

export default function ThemeToggle({ className = '' }) {
  const { scheme, toggle } = useTheme();
  const { t } = useTranslation();
  const dark = scheme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-card text-body transition hover:text-ink ${className}`}
    >
      {dark ? <LuSun className="h-[18px] w-[18px]" /> : <LuMoon className="h-[18px] w-[18px]" />}
    </button>
  );
}

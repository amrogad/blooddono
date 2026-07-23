import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const RegistrationButtons = () => {
  const { t } = useTranslation();
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link
        to="/login"
        className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-ink transition hover:bg-surface"
      >
        {t('nav.signIn')}
      </Link>
      <Link
        to="/register"
        className="inline-flex h-10 items-center rounded-xl bg-crimson px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
      >
        {t('nav.becomeDonor')}
      </Link>
    </div>
  );
};

export default RegistrationButtons;

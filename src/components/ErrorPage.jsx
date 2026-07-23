import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="font-display text-[88px] font-semibold leading-none text-crimson">404</div>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        {t('errorPage.title')}
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body">{t('errorPage.body')}</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-crimson px-5 text-sm font-semibold text-white transition hover:bg-crimson-deep"
      >
        {t('common.backHome')}
      </Link>
    </div>
  );
};

export default ErrorPage;

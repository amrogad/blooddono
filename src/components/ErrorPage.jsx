import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';

// Serves both jobs react-router routes here: a URL that matches nothing, and a
// component that threw. It used to render "404" for both, so a real crash told
// visitors the page did not exist and offered them no way to retry.
const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="font-display text-[88px] font-semibold leading-none text-crimson">
        {notFound ? '404' : '!'}
      </div>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        {notFound ? t('errorPage.title') : t('errorPage.crashTitle')}
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body">
        {notFound ? t('errorPage.body') : t('errorPage.crashBody')}
      </p>
      <div className="mt-6 flex items-center gap-3">
        {!notFound && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-11 items-center rounded-xl bg-crimson px-5 text-sm font-semibold text-white transition hover:bg-crimson-deep"
          >
            {t('errorPage.reload')}
          </button>
        )}
        <Link
          to="/"
          className={`inline-flex h-11 items-center rounded-xl px-5 text-sm font-semibold transition ${
            notFound
              ? 'bg-crimson text-white hover:bg-crimson-deep'
              : 'border border-line-strong text-ink hover:border-ink/40'
          }`}
        >
          {t('common.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

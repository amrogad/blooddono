import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { signIn } from '../../services/authService';
import { getPendingRequests } from '../../services/donationService';
import { getUrgency } from '../../utils/urgency';
import BrandMark from '../../components/BrandMark';
import { DEMO_ACCOUNTS } from '../../auth/demoAccounts';

const inputClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';

const Login = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [stat, setStat] = useState(null);

  useEffect(() => {
    getPendingRequests()
      .then((rows) => {
        setStat({
          open: rows.length,
          critical: rows.filter(
            (r) => getUrgency(r.donation_date, r.donation_time).level === 'critical',
          ).length,
        });
      })
      .catch(() => {});
  }, []);

  const goToRedirect = () => navigate(location.state ? location.state : '/');

  const handleSignIn = async (email, password) => {
    try {
      await signIn(email, password);
      goToRedirect();
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('auth.loginFailed'), text: error.message });
    }
  };

  const onSubmit = (data) => handleSignIn(data.email, data.password);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-5xl items-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-3xl border border-line shadow-[0_32px_64px_-32px_rgba(33,20,22,0.25)] lg:grid-cols-2">
        {/* brand panel */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-crimson-deep to-[#5e0a1f] p-11 lg:flex">
          <div className="pointer-events-none absolute -bottom-28 -end-24 h-80 w-80 rounded-full bg-white/5" />
          <div className="flex items-center gap-2.5">
            <BrandMark size={30} />
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              BloodDono
            </span>
          </div>
          <div>
            <div className="max-w-xs font-display text-[32px] font-semibold leading-tight tracking-tight text-white">
              {t('auth.brandHeadline')}
            </div>
            {stat && stat.open > 0 && (
              <div className="mt-6 inline-flex max-w-xs items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3.5">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-crimson-light" />
                <span className="text-[13.5px] leading-relaxed text-white/80">
                  <strong className="font-semibold text-white">
                    {t('auth.liveOpenBold', { count: stat.open })}
                  </strong>{' '}
                  {t('auth.liveOpenTail')}
                  {stat.critical > 0 ? t('auth.liveCritical', { count: stat.critical }) : ''}
                </span>
              </div>
            )}
          </div>
          <div className="text-[12.5px] text-white/60">{t('auth.trustLine')}</div>
        </div>

        {/* form panel */}
        <div className="flex flex-col justify-center bg-card p-8 sm:p-12">
          <h1 className="font-display text-[26px] font-semibold tracking-tight text-ink">
            {t('auth.welcome')}
          </h1>
          <p className="mt-1 mb-7 text-sm text-muted">
            {t('auth.newHere')}{' '}
            <Link to="/register" className="font-semibold text-crimson hover:text-crimson-deep">
              {t('auth.createProfile')}
            </Link>
            . {t('auth.takes90')}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-semibold text-ink">
                {t('auth.email')}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                placeholder={t('auth.emailPlaceholder')}
                {...register('email', {
                  required: t('validation.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('validation.emailPattern'),
                  },
                })}
                className={inputClass}
              />
              {errors.email && <p className="mt-1 text-sm text-crimson">{errors.email.message}</p>}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-[13px] font-semibold text-ink"
              >
                {t('auth.password')}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder={t('auth.passwordPlaceholder')}
                {...register('password', {
                  required: t('validation.passwordRequired'),
                  minLength: { value: 6, message: t('validation.passwordMin') },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                    message: t('validation.passwordPattern'),
                  },
                })}
                className={inputClass}
              />
              {errors.password && <p className="mt-1 text-sm text-crimson">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-crimson text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
            >
              {t('auth.signIn')}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">{t('auth.demoDivider')}</span>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleSignIn(acc.email, acc.password)}
                className="flex-1 rounded-xl border border-line px-3 py-2.5 text-[12.5px] font-medium text-body transition hover:border-line-strong hover:text-ink"
              >
                {t(`auth.role.${acc.role}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuArrowRight } from 'react-icons/lu';

const AboutUs = () => {
  const { t } = useTranslation();
  const reasons = t('about.reasons', { returnObjects: true });

  return (
    <div className="bg-paper">
      {/* header */}
      <section className="border-b border-line bg-gradient-to-b from-card to-paper">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-crimson/20 bg-crimson-tint px-3.5 py-1.5 text-[12.5px] font-semibold text-crimson">
            {t('about.badge')}
          </span>
          <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.08] tracking-tight text-ink">
            {t('about.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-body">{t('about.lead')}</p>
        </div>
      </section>

      {/* what we do */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
          {t('about.whyTitle')}
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-body">
          <p>{t('about.why1')}</p>
          <p>{t('about.why2')}</p>
        </div>
      </section>

      {/* why choose */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
            {t('about.doTitle')}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {reasons.map((reason) => (
              <div key={reason} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson-tint">
                  <LuCheck className="h-3.5 w-3.5 text-crimson" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-body">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it's built */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
          {t('about.howTitle')}
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-body">
          <p>{t('about.how1')}</p>
          <p>{t('about.how2')}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
          >
            {t('nav.becomeDonor')}
            <LuArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          </Link>
          <Link
            to="/blood-donation-request"
            className="inline-flex h-12 items-center rounded-xl border border-line-strong bg-card px-6 text-[15px] font-semibold text-ink transition hover:border-ink/40"
          >
            {t('about.ctaRequests')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

import { LuPlus, LuSearch, LuDroplet } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

const STEPS = [
  { icon: LuPlus, n: '01', key: 'posted' },
  { icon: LuSearch, n: '02', key: 'matched' },
  { icon: LuDroplet, n: '03', key: 'donate' },
];

const HowItWorks = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1180px] px-6 py-16">
        <h2 className="mb-8 font-display text-[27px] font-semibold tracking-tight text-ink">
          {t('home.how.title')}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, n, key }) => (
            <div
              key={n}
              className="rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(33,20,22,0.15)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-tint">
                  <Icon className="h-5 w-5 text-crimson" strokeWidth={2} />
                </div>
                <span className="font-display text-sm font-semibold text-line-strong">{n}</span>
              </div>
              <h3 className="mt-4 text-[16.5px] font-semibold text-ink">
                {t(`home.how.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-body">{t(`home.how.${key}.body`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

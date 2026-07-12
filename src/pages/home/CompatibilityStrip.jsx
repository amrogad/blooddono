import { useState } from 'react';
import { LuArrowDown, LuHeart } from 'react-icons/lu';
import { BLOOD_GROUPS, canDonate } from '../../utils/bloodCompat';

// Compatibility is the product, so the home page teaches it: pick a donor type
// and see who it can save. Same matrix the matching runs on — nothing invented.
const CompatibilityStrip = () => {
  const [donor, setDonor] = useState('O-');
  const recipients = BLOOD_GROUPS.filter((r) => canDonate(donor, r));
  const universal = recipients.length === BLOOD_GROUPS.length;

  return (
    <section className="border-y border-line bg-card">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-8 px-6 py-14 lg:flex-row lg:justify-between">
        <div className="max-w-xs text-center lg:text-left">
          <h2 className="font-display text-[27px] font-semibold leading-tight tracking-tight text-ink">
            Who can your blood save?
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-body">
            Tap your type. Most people can help more patients than they think.
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setDonor(g)}
                aria-pressed={donor === g}
                className={`flex h-[50px] w-[50px] items-center justify-center rounded-2xl font-display text-base font-bold transition ${
                  donor === g
                    ? 'bg-crimson text-white shadow-[0_0_0_3px_rgba(194,30,63,0.18)]'
                    : 'bg-surface text-body hover:bg-line-strong'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <LuArrowDown className="h-5 w-5 text-muted" />
          <div className="inline-flex items-center gap-3 rounded-2xl border border-crimson/15 bg-crimson-tint px-5 py-3.5">
            <LuHeart className="h-5 w-5 shrink-0 text-crimson" strokeWidth={2} />
            <span className="text-[15px] text-ink">
              {universal ? (
                <>
                  <strong className="font-bold">{donor} is the universal donor</strong>. Your blood
                  can go to every patient.
                </>
              ) : (
                <>
                  <strong className="font-bold">{donor}</strong> can donate to{' '}
                  <strong className="font-semibold text-crimson">{recipients.join(', ')}</strong>.
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompatibilityStrip;

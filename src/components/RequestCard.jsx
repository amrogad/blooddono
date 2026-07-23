import { useTranslation } from 'react-i18next';
import { LuDroplet } from 'react-icons/lu';
import BloodRoundel from './BloodRoundel';
import { UrgencyPill } from './Pills';
import { getUrgency, formatNeededBy } from '../utils/urgency';
import { localizeCity, localizeGov } from '../utils/places';

// The request card, web list-row variant — the anatomy shared across every
// surface. Roundel + who/where/when + one primary action on the row. No
// distance/hospital invented: shows hospital_name only when the payload has it
// (owner/detail views), otherwise the city/governorate the public list returns.
export default function RequestCard({ request, onDetails, onDonate, actionLabel }) {
  const { t } = useTranslation();
  const { level } = getUrgency(request.donation_date, request.donation_time);
  const loud = level === 'critical';
  const overdue = level === 'pastdue';
  const location =
    request.hospital_name ||
    [localizeCity(request.recipient_city), localizeGov(request.recipient_governorate)]
      .filter(Boolean)
      .join(', ');
  const neededBy = formatNeededBy(request.donation_date, request.donation_time);

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl bg-card p-4 transition duration-200 hover:-translate-y-0.5 ${
        loud
          ? 'border border-crimson/40 shadow-[0_16px_36px_-18px_rgba(120,20,40,0.3)]'
          : 'border border-line shadow-[0_1px_2px_rgba(33,20,22,0.04)] hover:shadow-[0_14px_30px_-16px_rgba(33,20,22,0.2)]'
      }`}
    >
      <BloodRoundel group={request.blood_group} variant={loud ? 'solid' : 'tint'} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span dir="auto" className="truncate text-[15.5px] font-semibold text-ink">
            {request.recipient_name}
          </span>
          <UrgencyPill level={level} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          <span dir="auto" className="truncate">
            {location}
          </span>
          <span className="text-line-strong">·</span>
          <span className={`font-semibold ${loud || overdue ? 'text-crimson' : 'text-ink'}`}>
            {neededBy}
          </span>
        </div>
      </div>

      {onDetails && (
        <button
          type="button"
          onClick={onDetails}
          className="hidden h-[42px] shrink-0 items-center rounded-xl px-4 text-[13.5px] font-semibold text-body hover:text-ink sm:inline-flex"
        >
          {t('card.details')}
        </button>
      )}

      {onDonate && (
        <button
          type="button"
          onClick={onDonate}
          className={`inline-flex h-[42px] shrink-0 items-center gap-2 rounded-xl px-[18px] text-[13.5px] font-semibold transition ${
            loud
              ? 'bg-crimson text-white shadow-[0_6px_14px_-6px_rgba(156,14,46,0.55)] hover:bg-crimson-deep'
              : 'border border-crimson/40 text-crimson hover:bg-crimson-tint'
          }`}
        >
          <LuDroplet className="h-3.5 w-3.5" strokeWidth={2.2} />
          {actionLabel ?? t('card.canDonate')}
        </button>
      )}
    </div>
  );
}

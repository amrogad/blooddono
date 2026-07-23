import { useTranslation } from 'react-i18next';
import { LuEllipsis } from 'react-icons/lu';
import BloodRoundel from './BloodRoundel';
import { StatusPill } from './Pills';
import { formatNeededBy } from '../utils/urgency';
import { localizeCity } from '../utils/places';

// A request the current user owns, shown as a card with one primary action per
// state and the rest tucked behind a menu. Shared by the donor overview and the
// full "my requests" list.
export default function DonorRequestCard({ req, onStatus, onDelete, onEdit, onView }) {
  const { t } = useTranslation();
  const location = [req.hospital_name, localizeCity(req.recipient_city)].filter(Boolean).join(' · ');
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="flex items-center gap-3">
        <BloodRoundel group={req.blood_group} variant="tint" size={46} />
        <div className="min-w-0 flex-1">
          <div dir="auto" className="truncate text-[15px] font-semibold text-ink">
            {req.recipient_name}
          </div>
          <div dir="auto" className="truncate text-[12.5px] text-muted">
            {location} · {formatNeededBy(req.donation_date, req.donation_time)}
          </div>
        </div>
        <StatusPill status={req.donation_status} />
      </div>

      {req.donation_status === 'inprogress' && req.donor_name && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-paper px-3 py-2 text-[13px]">
          <span dir="auto" className="font-semibold text-ink">
            {req.donor_name}
          </span>
          <span className="text-muted">{t('donorCard.acceptedThisRequest')}</span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {req.donation_status === 'inprogress' ? (
          <button
            onClick={() => onStatus(req.id, 'done')}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-crimson text-[13.5px] font-semibold text-white transition hover:bg-crimson-deep"
          >
            {t('donorCard.markDonated')}
          </button>
        ) : (
          <button
            onClick={() => onView(req.id)}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-line-strong text-[13.5px] font-semibold text-ink transition hover:border-ink/40"
          >
            {t('donorCard.viewDetails')}
          </button>
        )}

        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-body hover:text-ink"
            aria-label={t('donorCard.moreActions')}
          >
            <LuEllipsis className="h-4 w-4" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu z-10 mt-1 w-44 rounded-2xl border border-line bg-card p-2 shadow-[0_24px_56px_-16px_rgba(33,20,22,0.3)]"
          >
            <li>
              <button
                onClick={() => onView(req.id)}
                className="rounded-xl px-3 py-2 text-[13.5px] text-ink hover:bg-surface"
              >
                {t('donorCard.view')}
              </button>
            </li>
            {req.donation_status === 'inprogress' && (
              <li>
                <button
                  onClick={() => onStatus(req.id, 'canceled')}
                  className="rounded-xl px-3 py-2 text-[13.5px] text-ink hover:bg-surface"
                >
                  {t('donorCard.cancelRequest')}
                </button>
              </li>
            )}
            <li>
              <button
                onClick={() => onEdit(req.id)}
                className="rounded-xl px-3 py-2 text-[13.5px] text-ink hover:bg-surface"
              >
                {t('donorCard.editDetails')}
              </button>
            </li>
            <li className="mt-1 border-t border-line pt-1">
              <button
                onClick={() => onDelete(req.id)}
                className="rounded-xl px-3 py-2 text-[13.5px] font-medium text-crimson hover:bg-crimson-tint"
              >
                {t('donorCard.deleteForever')}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

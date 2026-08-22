import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuCheck, LuPencil, LuX } from 'react-icons/lu';
import BloodRoundel from './BloodRoundel';
import { UrgencyPill } from './Pills';
import { createDonationRequest } from '../services/donationService';
import { getUrgency, formatNeededBy } from '../utils/urgency';
import { localizeGov, localizeCity } from '../utils/places';

// What the assistant drafted, laid out the way step 3 of the create form lays it
// out — the card you approve should look like the card you'd have previewed if
// you had filled the form yourself.
//
// The model never writes. It hands back a validated draft and this component
// does the insert with the user's own JWT, so the row is subject to the same
// insert policy as the form: requester_id has to be auth.uid().
const RequestDraftCard = ({ draft, onPosted }) => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [state, setState] = useState('idle');
  const [posted, setPosted] = useState(null);

  const urgency = getUrgency(draft.donation_date, draft.donation_time);
  // Signing in navigates before the profile fetch that fills in auth.user has
  // returned, so for a moment after login there is a session but no user object
  // to stamp on the row. Confirming in that window used to read uid off null and
  // report a failed post that never left the browser.
  const ready = Boolean(user?.uid);

  const confirm = async () => {
    // The draft is spent the moment it is accepted. Without this a second click
    // during the insert posts the same request twice.
    if (state !== 'idle' || !ready) return;
    setState('saving');
    try {
      const row = await createDonationRequest({
        ...draft,
        requester_id: user.uid,
        requester_name: user.displayName,
        requester_email: user.email,
      });
      setPosted(row);
      setState('posted');
      onPosted?.(row);
    } catch {
      setState('failed');
    }
  };

  if (state === 'dismissed') {
    return <p className="text-[13px] italic text-muted">{t('draft.dismissed')}</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="border-b border-line bg-paper px-3.5 py-2 text-[10.5px] font-bold uppercase tracking-wider text-muted">
        {state === 'posted' ? t('draft.postedLabel') : t('draft.reviewLabel')}
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-3">
          <BloodRoundel
            group={draft.blood_group}
            variant={urgency.level === 'critical' ? 'solid' : 'tint'}
            size={44}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span dir="auto" className="truncate text-[14.5px] font-semibold text-ink">
                {draft.recipient_name}
              </span>
              <UrgencyPill level={urgency.level} />
            </div>
            <div dir="auto" className="mt-0.5 truncate text-[12.5px] text-muted">
              {draft.hospital_name} · {localizeCity(draft.recipient_city)},{' '}
              {localizeGov(draft.recipient_governorate)}
            </div>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-paper px-3 py-2.5">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {t('card.neededBy')}
            </dt>
            <dd className="mt-0.5 text-[13px] font-semibold text-ink">
              {formatNeededBy(draft.donation_date, draft.donation_time)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              {t('draft.address')}
            </dt>
            <dd dir="auto" className="mt-0.5 truncate text-[13px] font-semibold text-ink">
              {draft.full_address}
            </dd>
          </div>
        </dl>

        <p dir="auto" className="mt-2.5 text-[12.5px] leading-relaxed text-body">
          {draft.request_message}
        </p>
      </div>

      {state === 'posted' ? (
        <div className="flex items-center gap-2 border-t border-line px-3.5 py-2.5">
          <LuCheck className="h-4 w-4 shrink-0 text-success" strokeWidth={2.5} />
          <span className="flex-1 text-[12.5px] font-medium text-ink">{t('draft.posted')}</span>
          <button
            type="button"
            onClick={() => navigate(`/home-donation-request-details/${posted.id}`)}
            className="text-[12.5px] font-semibold text-crimson hover:underline"
          >
            {t('draft.view')}
          </button>
        </div>
      ) : (
        <div className="border-t border-line p-2.5">
          {state === 'failed' && (
            <p className="mb-2 px-1 text-[12px] text-crimson">{t('draft.failed')}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={state === 'saving' || !ready}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-crimson text-[13px] font-semibold text-white transition hover:bg-crimson-deep disabled:opacity-60"
            >
              <LuCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
              {state === 'saving' ? t('draft.posting') : t('draft.confirm')}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/create-donation-request', { state: { draft } })
              }
              aria-label={t('draft.edit')}
              title={t('draft.edit')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:text-ink"
            >
              <LuPencil className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setState('dismissed')}
              aria-label={t('draft.discard')}
              title={t('draft.discard')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:text-ink"
            >
              <LuX className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDraftCard;

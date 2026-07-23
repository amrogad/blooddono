import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import Loading from '../../../components/Loading';
import BloodRoundel from '../../../components/BloodRoundel';
import { StatusPill } from '../../../components/Pills';
import { formatNeededBy } from '../../../utils/urgency';
import { getDonationRequest } from '../../../services/donationService';
import { localizeGov, localizeCity } from '../../../utils/places';

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 border-t border-line py-3 first:border-0 sm:flex-row sm:gap-4">
    <span className="w-40 shrink-0 text-[13px] font-semibold uppercase tracking-wide text-muted">
      {label}
    </span>
    <span className="text-[15px] text-ink">{value}</span>
  </div>
);

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonationRequest(id)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!request) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('detail.notFound')}</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep"
        >
          <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          {t('detail.backDashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-body transition hover:text-ink"
      >
        <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
        {t('create.back')}
      </button>

      <div className="mt-5 rounded-3xl border border-line bg-card p-6">
        <div className="flex items-center gap-4">
          <BloodRoundel group={request.blood_group} variant="tint" size={56} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 dir="auto" className="font-display text-[22px] font-semibold tracking-tight text-ink">
                {request.recipient_name}
              </h1>
              <StatusPill status={request.donation_status} />
            </div>
            <p dir="auto" className="mt-0.5 text-[13.5px] text-muted">
              {[localizeCity(request.recipient_city), localizeGov(request.recipient_governorate)]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <DetailRow
            label={t('detail.requestedBy')}
            value={<span dir="auto">{request.requester_name}</span>}
          />
          <DetailRow
            label={t('detail.hospital')}
            value={<span dir="auto">{request.hospital_name}</span>}
          />
          <DetailRow
            label={t('detail.address')}
            value={<span dir="auto">{request.full_address}</span>}
          />
          <DetailRow
            label={t('detail.neededBy')}
            value={formatNeededBy(request.donation_date, request.donation_time)}
          />
          {request.request_message && (
            <DetailRow
              label={t('detail.message')}
              value={<span dir="auto">{request.request_message}</span>}
            />
          )}
          {request.donation_status === 'inprogress' && request.donor_name && (
            <DetailRow
              label={t('detail.donor')}
              value={<span dir="auto">{`${request.donor_name} · ${request.donor_email}`}</span>}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationRequestDetails;

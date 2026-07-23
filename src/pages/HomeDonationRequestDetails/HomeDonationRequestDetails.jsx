import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { LuArrowLeft, LuDroplet } from 'react-icons/lu';
import Loading from '../../components/Loading';
import BloodRoundel from '../../components/BloodRoundel';
import { UrgencyPill } from '../../components/Pills';
import { getUrgency, formatNeededBy } from '../../utils/urgency';
import { compatibleDonorsFor } from '../../utils/bloodCompat';
import { getRequestDetails, acceptRequest } from '../../services/donationService';
import { localizeGov, localizeCity } from '../../utils/places';

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 border-t border-line py-3 first:border-0 sm:flex-row sm:gap-4">
    <span className="w-40 shrink-0 text-[13px] font-semibold uppercase tracking-wide text-muted">
      {label}
    </span>
    <span className="text-[15px] text-ink">{value}</span>
  </div>
);

const HomeDonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getRequestDetails(id)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDonateConfirm = async () => {
    setSubmitting(true);
    try {
      await acceptRequest(id);
      setModalOpen(false);
      Swal.fire(t('detail.acceptedTitle'), t('detail.acceptedBody'), 'success');
      navigate('/blood-donation-request');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('detail.acceptError'), text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (!request) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('detail.notFound')}</h1>
        <Link
          to="/blood-donation-request"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep"
        >
          <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
          {t('detail.backRequests')}
        </Link>
      </div>
    );
  }

  const { level } = getUrgency(request.donation_date, request.donation_time);

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <Link
        to="/blood-donation-request"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-body transition hover:text-ink"
      >
        <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
        {t('dash.allRequests')}
      </Link>

      <div className="mt-5 rounded-3xl border border-line bg-card p-6">
        <div className="flex items-center gap-4">
          <BloodRoundel
            group={request.blood_group}
            variant={level === 'critical' ? 'solid' : 'tint'}
            size={56}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 dir="auto" className="font-display text-[22px] font-semibold tracking-tight text-ink">
                {request.recipient_name}
              </h1>
              <UrgencyPill level={level} />
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
            label={t('detail.hospital')}
            value={<span dir="auto">{request.hospital_name}</span>}
          />
          <DetailRow
            label={t('detail.address')}
            value={<span dir="auto">{request.full_address}</span>}
          />
          <DetailRow
            label={t('detail.neededBy')}
            value={
              <span className={level === 'critical' || level === 'pastdue' ? 'text-crimson' : ''}>
                {formatNeededBy(request.donation_date, request.donation_time)}
              </span>
            }
          />
          <DetailRow
            label={t('card.compatibleDonors')}
            value={
              <span dir="ltr" className="font-semibold text-success">
                {compatibleDonorsFor(request.blood_group).join('  ')}
              </span>
            }
          />
          {request.request_message && (
            <DetailRow
              label={t('detail.message')}
              value={<span dir="auto">{request.request_message}</span>}
            />
          )}
        </div>

        {request.donation_status === 'pending' ? (
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-crimson text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep sm:w-auto sm:px-8"
          >
            <LuDroplet className="h-[18px] w-[18px]" strokeWidth={2.2} />
            {t('card.canDonate')}
          </button>
        ) : (
          <p className="mt-6 text-sm text-muted">{t('detail.closed')}</p>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-line bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-semibold text-ink">{t('detail.confirmTitle')}</h2>
            <p className="mt-1 text-sm text-muted">{t('detail.confirmBody')}</p>
            <div className="mt-4 space-y-1.5 rounded-xl bg-paper p-4 text-sm">
              <p className="text-ink">
                <span className="text-muted">{t('detail.nameLabel')}</span>{' '}
                <span dir="auto">{user.displayName}</span>
              </p>
              <p className="text-ink">
                <span className="text-muted">{t('detail.emailLabel')}</span>{' '}
                <span dir="auto">{user.email}</span>
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleDonateConfirm}
                disabled={submitting}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-deep disabled:opacity-60"
              >
                {submitting ? t('payment.processing') : t('common.confirm')}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition hover:border-ink/40"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDonationRequestDetails;

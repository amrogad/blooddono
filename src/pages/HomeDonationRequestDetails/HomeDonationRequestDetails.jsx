import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { LuArrowLeft, LuDroplet } from 'react-icons/lu';
import Loading from '../../components/Loading';
import BloodRoundel from '../../components/BloodRoundel';
import { UrgencyPill } from '../../components/Pills';
import { getUrgency, formatNeededBy } from '../../utils/urgency';
import { compatibleDonorsFor } from '../../utils/bloodCompat';
import { getRequestDetails, acceptRequest } from '../../services/donationService';

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
      Swal.fire('Success', 'You are now a donor for this request.', 'success');
      navigate('/blood-donation-request');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Could not accept request', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (!request) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Request not found</h1>
        <Link
          to="/blood-donation-request"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-deep"
        >
          <LuArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to requests
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
        <LuArrowLeft className="h-4 w-4" strokeWidth={2} />
        All requests
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
              <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">
                {request.recipient_name}
              </h1>
              <UrgencyPill level={level} />
            </div>
            <p className="mt-0.5 text-[13.5px] text-muted">
              {[request.recipient_city, request.recipient_governorate].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <DetailRow label="Hospital" value={request.hospital_name} />
          <DetailRow label="Address" value={request.full_address} />
          <DetailRow
            label="Needed by"
            value={
              <span className={level === 'critical' || level === 'pastdue' ? 'text-crimson' : ''}>
                {formatNeededBy(request.donation_date, request.donation_time)}
              </span>
            }
          />
          <DetailRow
            label="Compatible donors"
            value={
              <span className="font-semibold text-success">
                {compatibleDonorsFor(request.blood_group).join('  ')}
              </span>
            }
          />
          {request.request_message && (
            <DetailRow label="Message" value={request.request_message} />
          )}
        </div>

        {request.donation_status === 'pending' ? (
          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-crimson text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep sm:w-auto sm:px-8"
          >
            <LuDroplet className="h-[18px] w-[18px]" strokeWidth={2.2} />
            I can donate
          </button>
        ) : (
          <p className="mt-6 text-sm text-muted">
            This request is no longer accepting donors.
          </p>
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
            <h2 className="font-display text-xl font-semibold text-ink">Confirm donation</h2>
            <p className="mt-1 text-sm text-muted">
              The requester will be able to contact you as their donor.
            </p>
            <div className="mt-4 space-y-1.5 rounded-xl bg-paper p-4 text-sm">
              <p className="text-ink">
                <span className="text-muted">Name:</span> {user.displayName}
              </p>
              <p className="text-ink">
                <span className="text-muted">Email:</span> {user.email}
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleDonateConfirm}
                disabled={submitting}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-deep disabled:opacity-60"
              >
                {submitting ? 'Processing…' : 'Confirm'}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink transition hover:border-ink/40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDonationRequestDetails;

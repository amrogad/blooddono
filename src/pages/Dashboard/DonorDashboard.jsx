import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { LuPlus, LuArrowRight } from 'react-icons/lu';
import Loading from '../../components/Loading';
import DonorRequestCard from '../../components/DonorRequestCard';
import {
  getMyDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../services/donationService';

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getMyDonationRequests(user.uid)
      .then((data) => setRequests(data.slice(0, 6)))
      .catch((error) =>
        Swal.fire({ icon: 'error', title: t('dash.loadRequestsError'), text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [user?.uid, t]);

  const handleStatus = async (id, status) => {
    try {
      await updateDonationRequest(id, { donation_status: status });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, donation_status: status } : req)),
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: t('dash.deleteTitle'),
      text: t('dash.deleteBody'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('common.delete'),
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteDonationRequest(id);
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } catch (error) {
        Swal.fire({ icon: 'error', title: t('dash.deleteFailed'), text: error.message });
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-[13.5px] text-muted">{t('dash.welcomeBack')}</div>
          <h1 className="mt-0.5 font-display text-[28px] font-semibold tracking-tight text-ink">
            {user?.displayName}
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard/create-donation-request')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
        >
          <LuPlus className="h-4 w-4" strokeWidth={2.4} />
          {t('browse.newRequest')}
        </button>
      </div>

      {requests.length > 0 ? (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">{t('dash.yourRequests')}</h2>
            <button
              onClick={() => navigate('/dashboard/my-donation-requests')}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-crimson hover:text-crimson-deep"
            >
              {t('dash.viewAll')}
              <LuArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2} />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {requests.map((req) => (
              <DonorRequestCard
                key={req.id}
                req={req}
                onStatus={handleStatus}
                onDelete={handleDelete}
                onEdit={(id) => navigate(`/dashboard/edit-donation-request/${id}`)}
                onView={(id) => navigate(`/dashboard/donation-details/${id}`)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-line bg-card p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">{t('dash.donorEmptyTitle')}</p>
          <p className="mt-1 text-sm text-muted">{t('dash.donorEmptyBody')}</p>
          <button
            onClick={() => navigate('/dashboard/create-donation-request')}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white transition hover:bg-crimson-deep"
          >
            <LuPlus className="h-4 w-4" strokeWidth={2.4} />
            {t('browse.newRequest')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;

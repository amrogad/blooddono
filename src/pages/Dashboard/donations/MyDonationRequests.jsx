import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';
import Loading from '../../../components/Loading';
import DonorRequestCard from '../../../components/DonorRequestCard';
import {
  getMyDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../../services/donationService';

const FILTERS = [
  { key: 'all', labelKey: 'myReq.filterAll' },
  { key: 'pending', labelKey: 'myReq.filterPending' },
  { key: 'inprogress', labelKey: 'myReq.filterInprogress' },
  { key: 'done', labelKey: 'myReq.filterDone' },
  { key: 'canceled', labelKey: 'myReq.filterCanceled' },
];
const PER_PAGE = 6;

const MyDonationRequests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user?.uid) return;
    getMyDonationRequests(user.uid)
      .then(setRequests)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: t('dash.loadRequestsError'), text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [user?.uid, t]);

  const handleStatus = async (id, donation_status) => {
    try {
      await updateDonationRequest(id, { donation_status });
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, donation_status } : req)));
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

  const filtered =
    filter === 'all' ? requests : requests.filter((req) => req.donation_status === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
          {t('dash.myRequests')}
        </h1>
        <button
          onClick={() => navigate('/dashboard/create-donation-request')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
        >
          <LuPlus className="h-4 w-4" strokeWidth={2.4} />
          {t('browse.newRequest')}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`h-9 rounded-full px-4 text-[13px] font-semibold transition ${
              filter === f.key
                ? 'bg-ink text-on-ink'
                : 'border border-line bg-card text-body hover:text-ink'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      {pageItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {pageItems.map((req) => (
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
      ) : (
        <div className="rounded-2xl border border-line bg-card p-10 text-center text-sm text-muted">
          {t('myReq.empty')}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                page === i + 1
                  ? 'bg-crimson text-white'
                  : 'border border-line bg-card text-body hover:text-ink'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;

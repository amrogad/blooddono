import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getMyDonationRequests(user.uid)
      .then((data) => setRequests(data.slice(0, 6)))
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load requests', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleStatus = async (id, status) => {
    try {
      await updateDonationRequest(id, { donation_status: status });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, donation_status: status } : req)),
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete this request?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteDonationRequest(id);
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-[13.5px] text-muted">Welcome back</div>
          <h1 className="mt-0.5 font-display text-[28px] font-semibold tracking-tight text-ink">
            {user?.displayName}
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard/create-donation-request')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
        >
          <LuPlus className="h-4 w-4" strokeWidth={2.4} />
          New request
        </button>
      </div>

      {requests.length > 0 ? (
        <>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Your requests</h2>
            <button
              onClick={() => navigate('/dashboard/my-donation-requests')}
              className="text-[13px] font-semibold text-crimson hover:text-crimson-deep"
            >
              View all →
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
          <p className="text-[15px] font-semibold text-ink">You have no requests yet</p>
          <p className="mt-1 text-sm text-muted">
            Post one and compatible donors nearby will see it right away.
          </p>
          <button
            onClick={() => navigate('/dashboard/create-donation-request')}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white transition hover:bg-crimson-deep"
          >
            <LuPlus className="h-4 w-4" strokeWidth={2.4} />
            New request
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;

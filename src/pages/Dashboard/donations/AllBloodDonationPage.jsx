import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';
import Swal from 'sweetalert2';
import useUserRole from '../../../hooks/useUserRole';
import Loading from '../../../components/Loading';
import BloodRoundel from '../../../components/BloodRoundel';
import { StatusPill } from '../../../components/Pills';
import { formatNeededBy } from '../../../utils/urgency';
import {
  getDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../../services/donationService';

const PER_PAGE = 8;
const selectClass = 'h-9 rounded-lg border border-line-strong bg-card px-2 text-[13px] text-ink';

const AllBloodDonationPage = () => {
  const { role } = useUserRole();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getDonationRequests()
      .then(setDonations)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load requests', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDonationRequest(id, { donation_status: newStatus });
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, donation_status: newStatus } : d)),
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this request?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });
    if (!confirm.isConfirmed) return;
    try {
      await deleteDonationRequest(id);
      setDonations((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
    }
  };

  const filtered = filter === 'all' ? donations : donations.filter((d) => d.donation_status === filter);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
          All requests
        </h1>
        <select
          aria-label="Filter by status"
          className="h-10 rounded-xl border border-line-strong bg-card px-3 text-sm text-ink"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="pending">Searching</option>
          <option value="inprogress">Matched</option>
          <option value="done">Completed</option>
          <option value="canceled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {pageItems.map((d, index) => (
          <div
            key={d.id}
            className={`flex flex-wrap items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <BloodRoundel group={d.blood_group} variant="tint" size={40} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold text-ink">{d.recipient_name}</div>
              <div className="truncate text-xs text-muted">
                {[d.recipient_city, d.recipient_governorate].filter(Boolean).join(', ')} ·{' '}
                {formatNeededBy(d.donation_date, d.donation_time)}
              </div>
            </div>

            {role === 'admin' ? (
              <select
                aria-label={`Status for ${d.recipient_name}`}
                className={selectClass}
                value={d.donation_status}
                onChange={(e) => handleStatusChange(d.id, e.target.value)}
              >
                <option value="pending">Searching</option>
                <option value="inprogress">Matched</option>
                <option value="done">Completed</option>
                <option value="canceled">Cancelled</option>
              </select>
            ) : (
              <StatusPill status={d.donation_status} />
            )}

            <button
              aria-label={`View ${d.recipient_name}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body hover:text-ink"
              onClick={() => setSelected(d)}
            >
              <LuEye className="h-4 w-4" />
            </button>
            {role === 'admin' && (
              <>
                <Link
                  to={`/dashboard/admin-edit-donation/${d.id}`}
                  aria-label={`Edit ${d.recipient_name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body hover:text-ink"
                >
                  <LuPencil className="h-4 w-4" />
                </Link>
                <button
                  aria-label={`Delete ${d.recipient_name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-crimson hover:bg-crimson-tint"
                  onClick={() => handleDelete(d.id)}
                >
                  <LuTrash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
        {pageItems.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">No requests found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                page === idx + 1
                  ? 'bg-crimson text-white'
                  : 'border border-line bg-card text-body hover:text-ink'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-line bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <BloodRoundel group={selected.blood_group} variant="tint" size={44} />
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {selected.recipient_name}
                </h2>
                <StatusPill status={selected.donation_status} />
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-body">
              <p>
                <span className="text-muted">Hospital:</span> {selected.hospital_name}
              </p>
              <p>
                <span className="text-muted">Address:</span> {selected.full_address}
              </p>
              <p>
                <span className="text-muted">Needed by:</span>{' '}
                {formatNeededBy(selected.donation_date, selected.donation_time)}
              </p>
            </div>
            <button
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-deep"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBloodDonationPage;

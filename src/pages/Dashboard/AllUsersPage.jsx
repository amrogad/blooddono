import { useEffect, useState } from 'react';
import { LuEye } from 'react-icons/lu';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import { getAllProfiles, setUserRole, setUserStatus } from '../../services/profileService';

const USERS_PER_PAGE = 8;

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllProfiles()
      .then(setUsers)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load users', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await setUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      Swal.fire({ icon: 'success', title: 'Role Updated!', showConfirmButton: false, timer: 1000 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await setUserStatus(id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      Swal.fire({ icon: 'success', title: 'Status Updated!', showConfirmButton: false, timer: 1000 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const filteredUsers =
    statusFilter === 'all' ? users : users.filter((u) => u.status === statusFilter);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE,
  );

  if (loading) return <Loading />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">Users</h1>
        <select
          aria-label="Filter by status"
          className="h-10 rounded-xl border border-line-strong bg-card px-3 text-sm text-ink"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {paginatedUsers.map((user, index) => (
          <div
            key={user.id}
            className={`flex flex-wrap items-center gap-3 px-4 py-3 ${
              index > 0 ? 'border-t border-line' : ''
            }`}
          >
            <img
              src={user.photo_url || '/images/person-avatar.png'}
              alt=""
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold text-ink">
                {user.display_name}
              </div>
              <div className="truncate text-xs text-muted">
                {[user.city, user.governorate].filter(Boolean).join(', ') || 'No location'}
              </div>
            </div>

            {user.blood_group && (
              <span className="rounded-lg bg-crimson-tint px-2 py-1 font-display text-[12.5px] font-bold text-crimson">
                {user.blood_group}
              </span>
            )}

            <select
              aria-label={`Role for ${user.display_name}`}
              className="h-9 rounded-lg border border-line-strong bg-card px-2 text-[13px] text-ink"
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                user.status === 'active'
                  ? 'bg-success-tint text-success'
                  : 'bg-crimson-tint text-crimson'
              }`}
            >
              {user.status === 'active' ? 'Active' : 'Blocked'}
            </span>

            {user.status === 'active' ? (
              <button
                className="h-9 rounded-lg border border-line-strong px-3 text-[13px] font-semibold text-ink transition hover:border-ink/40"
                onClick={() => handleStatusChange(user.id, 'blocked')}
              >
                Block
              </button>
            ) : (
              <button
                className="h-9 rounded-lg border border-line-strong px-3 text-[13px] font-semibold text-ink transition hover:border-ink/40"
                onClick={() => handleStatusChange(user.id, 'active')}
              >
                Unblock
              </button>
            )}

            <button
              aria-label={`View ${user.display_name}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body hover:text-ink"
              onClick={() => setSelectedUser(user)}
            >
              <LuEye className="h-4 w-4" />
            </button>
          </div>
        ))}
        {paginatedUsers.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">No users found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                currentPage === idx + 1
                  ? 'bg-crimson text-white'
                  : 'border border-line bg-card text-body hover:text-ink'
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-line bg-card p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedUser.photo_url || '/images/person-avatar.png'}
              alt=""
              className="mx-auto h-24 w-24 rounded-2xl object-cover"
            />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">
              {selectedUser.display_name}
            </h2>
            <div className="mt-4 space-y-1.5 text-left text-sm text-body">
              <p>
                <span className="text-muted">Blood group:</span> {selectedUser.blood_group || '—'}
              </p>
              <p>
                <span className="text-muted">Location:</span>{' '}
                {[selectedUser.city, selectedUser.governorate].filter(Boolean).join(', ') || '—'}
              </p>
              <p>
                <span className="text-muted">Role:</span> <span className="capitalize">{selectedUser.role}</span>
              </p>
              <p>
                <span className="text-muted">Status:</span>{' '}
                <span className="capitalize">{selectedUser.status}</span>
              </p>
            </div>
            <button
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-deep"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;

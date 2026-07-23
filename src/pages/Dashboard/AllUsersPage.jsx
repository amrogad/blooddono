import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuEye } from 'react-icons/lu';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import { getAllProfiles, setUserRole, setUserStatus } from '../../services/profileService';
import { localizeGov, localizeCity } from '../../utils/places';

const USERS_PER_PAGE = 8;

const AllUsersPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllProfiles()
      .then(setUsers)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: t('users.loadError'), text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [t]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await setUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      Swal.fire({ icon: 'success', title: t('users.roleUpdated'), showConfirmButton: false, timer: 1000 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await setUserStatus(id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
      Swal.fire({ icon: 'success', title: t('users.statusUpdated'), showConfirmButton: false, timer: 1000 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
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
        <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
          {t('dash.users')}
        </h1>
        <select
          aria-label={t('users.filterStatus')}
          className="h-10 rounded-xl border border-line-strong bg-card px-3 text-sm text-ink"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">{t('users.allStatuses')}</option>
          <option value="active">{t('users.active')}</option>
          <option value="blocked">{t('users.blocked')}</option>
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
              <div dir="auto" className="truncate text-[14.5px] font-semibold text-ink">
                {user.display_name}
              </div>
              <div dir="auto" className="truncate text-xs text-muted">
                {[localizeCity(user.city), localizeGov(user.governorate)]
                  .filter(Boolean)
                  .join(', ') || t('users.noLocation')}
              </div>
            </div>

            {user.blood_group && (
              <span
                dir="ltr"
                className="rounded-lg bg-crimson-tint px-2 py-1 font-display text-[12.5px] font-bold text-crimson"
              >
                {user.blood_group}
              </span>
            )}

            <select
              aria-label={t('users.roleFor', { name: user.display_name })}
              className="h-9 rounded-lg border border-line-strong bg-card px-2 text-[13px] text-ink"
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="donor">{t('auth.role.donor')}</option>
              <option value="volunteer">{t('auth.role.volunteer')}</option>
              <option value="admin">{t('auth.role.admin')}</option>
            </select>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                user.status === 'active'
                  ? 'bg-success-tint text-success'
                  : 'bg-crimson-tint text-crimson'
              }`}
            >
              {user.status === 'active' ? t('users.active') : t('users.blocked')}
            </span>

            {user.status === 'active' ? (
              <button
                className="h-9 rounded-lg border border-line-strong px-3 text-[13px] font-semibold text-ink transition hover:border-ink/40"
                onClick={() => handleStatusChange(user.id, 'blocked')}
              >
                {t('users.block')}
              </button>
            ) : (
              <button
                className="h-9 rounded-lg border border-line-strong px-3 text-[13px] font-semibold text-ink transition hover:border-ink/40"
                onClick={() => handleStatusChange(user.id, 'active')}
              >
                {t('users.unblock')}
              </button>
            )}

            <button
              aria-label={t('users.viewUser', { name: user.display_name })}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body hover:text-ink"
              onClick={() => setSelectedUser(user)}
            >
              <LuEye className="h-4 w-4" />
            </button>
          </div>
        ))}
        {paginatedUsers.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">{t('users.empty')}</div>
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
            <h2 dir="auto" className="mt-4 font-display text-xl font-semibold text-ink">
              {selectedUser.display_name}
            </h2>
            <div className="mt-4 space-y-1.5 text-start text-sm text-body">
              <p>
                <span className="text-muted">{t('users.bloodGroupLabel')}</span>{' '}
                <span dir="ltr">{selectedUser.blood_group || '—'}</span>
              </p>
              <p>
                <span className="text-muted">{t('users.locationLabel')}</span>{' '}
                {[localizeCity(selectedUser.city), localizeGov(selectedUser.governorate)]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </p>
              <p>
                <span className="text-muted">{t('users.roleLabel')}</span>{' '}
                {t(`auth.role.${selectedUser.role}`)}
              </p>
              <p>
                <span className="text-muted">{t('users.statusLabel')}</span>{' '}
                {selectedUser.status === 'active' ? t('users.active') : t('users.blocked')}
              </p>
            </div>
            <button
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-crimson text-sm font-semibold text-white transition hover:bg-crimson-deep"
              onClick={() => setSelectedUser(null)}
            >
              {t('users.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;

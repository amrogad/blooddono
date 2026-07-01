import { useEffect, useState } from 'react';
import { FaUserCheck, FaUserSlash, FaTrashAlt, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import { getAllProfiles, setUserRole, setUserStatus } from '../../services/profileService';

const USERS_PER_PAGE = 5;

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
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        showConfirmButton: false,
        timer: 1000,
      });
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

  const renderStatusIcon = (status) =>
    status === 'active' ? (
      <FaUserCheck className="text-green-500" />
    ) : (
      <FaUserSlash className="text-red-500" />
    );

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">All Users</h2>
      <div className="mb-4">
        <label>Status Filter:</label>
        <select
          className="select select-bordered ml-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Role</th>
              <th className="text-center">Current Status</th>
              <th className="text-center">Change Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                <td>
                  <img
                    src={user.photo_url || '/images/developer-avatar.jpg'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td>{user.display_name}</td>
                <td>{user.blood_group || '-'}</td>
                <td>
                  <select
                    className="select select-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className="flex justify-center items-center gap-2">
                    {renderStatusIcon(user.status)}
                    <span>{user.status}</span>
                  </div>
                </td>
                <td className="text-center">
                  {user.status === 'active' ? (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleStatusChange(user.id, 'blocked')}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleStatusChange(user.id, 'active')}
                    >
                      Unblock
                    </button>
                  )}
                </td>
                <td className="text-center">
                  <button className="btn btn-sm mr-2" onClick={() => setSelectedUser(user)}>
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-neutral' : 'btn-outline'}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="card bg-base-100 shadow-sm">
              <figure className="px-10 pt-10">
                <img
                  src={selectedUser.photo_url || '/images/developer-avatar.jpg'}
                  alt="User Avatar"
                  className="rounded-xl w-32"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{selectedUser.display_name}</h2>
              </div>
              <div className="p-4">
                <p>
                  <strong>Name:</strong> {selectedUser.display_name}
                </p>
                <p>
                  <strong>Blood Group:</strong> {selectedUser.blood_group || '-'}
                </p>
                <p>
                  <strong>Location:</strong> {selectedUser.governorate || '-'},{' '}
                  {selectedUser.city || '-'}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Status:</strong> {selectedUser.status}
                </p>
              </div>
              <div className="modal-action">
                <button className="btn btn-neutral m-4" onClick={() => setSelectedUser(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;

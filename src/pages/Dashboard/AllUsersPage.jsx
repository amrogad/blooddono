import { useState } from 'react';
import { FaUserCheck, FaUserSlash, FaTrashAlt, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';

const USERS_PER_PAGE = 5;

const sampleUsers = [
  {
    _id: '1',
    user_full_name: 'Ahmed Mostafa',
    user_email: 'ahmed.mostafa@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=11',
    user_blood_group: 'A+',
    user_governorate: 'Cairo',
    user_city: 'Nasr City',
    user_role: 'admin',
    user_status: 'active',
    user_created_at: '2024-02-10',
  },
  {
    _id: '2',
    user_full_name: 'Sara Hassan',
    user_email: 'sara.hassan@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=5',
    user_blood_group: 'O-',
    user_governorate: 'Giza',
    user_city: '6th of October',
    user_role: 'donor',
    user_status: 'active',
    user_created_at: '2024-03-22',
  },
  {
    _id: '3',
    user_full_name: 'Mohamed Ali',
    user_email: 'mohamed.ali@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=12',
    user_blood_group: 'B+',
    user_governorate: 'Alexandria',
    user_city: 'Sidi Gaber',
    user_role: 'volunteer',
    user_status: 'active',
    user_created_at: '2024-04-15',
  },
  {
    _id: '4',
    user_full_name: 'Nourhan Tarek',
    user_email: 'nourhan.tarek@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=20',
    user_blood_group: 'AB+',
    user_governorate: 'Qalyubia',
    user_city: 'Banha',
    user_role: 'donor',
    user_status: 'blocked',
    user_created_at: '2024-05-02',
  },
  {
    _id: '5',
    user_full_name: 'Youssef Adel',
    user_email: 'youssef.adel@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=15',
    user_blood_group: 'O+',
    user_governorate: 'Sharqia',
    user_city: 'Zagazig',
    user_role: 'donor',
    user_status: 'active',
    user_created_at: '2024-06-18',
  },
  {
    _id: '6',
    user_full_name: 'Mona Khaled',
    user_email: 'mona.khaled@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=9',
    user_blood_group: 'A-',
    user_governorate: 'Cairo',
    user_city: 'Heliopolis',
    user_role: 'volunteer',
    user_status: 'active',
    user_created_at: '2024-07-09',
  },
  {
    _id: '7',
    user_full_name: 'Karim Fathy',
    user_email: 'karim.fathy@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=33',
    user_blood_group: 'B-',
    user_governorate: 'Giza',
    user_city: 'Haram',
    user_role: 'donor',
    user_status: 'blocked',
    user_created_at: '2024-08-01',
  },
  {
    _id: '8',
    user_full_name: 'Laila Mansour',
    user_email: 'laila.mansour@example.com',
    user_photo_url: 'https://i.pravatar.cc/150?img=24',
    user_blood_group: 'AB-',
    user_governorate: 'Alexandria',
    user_city: 'Montaza',
    user_role: 'donor',
    user_status: 'active',
    user_created_at: '2024-09-12',
  },
];

const AllUsersPage = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, user_role: newRole } : u))
    );
    Swal.fire({ icon: 'success', title: 'Role Updated!', showConfirmButton: false, timer: 1000 });
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, user_status: newStatus } : u))
    );
    Swal.fire({ icon: 'success', title: 'Status Updated!', showConfirmButton: false, timer: 1000 });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      Swal.fire('Deleted!', 'User has been deleted.', 'success');
    }
  };

  const filteredUsers = statusFilter === 'all' ? users : users.filter(u => u.user_status === statusFilter);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE);

  const renderStatusIcon = (status) =>
    status === 'active' ? <FaUserCheck className="text-green-500" /> : <FaUserSlash className="text-red-500" />;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">All Users</h2>
      <div className="mb-4">
        <label>Status Filter:</label>
        <select className="select select-bordered ml-2" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
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
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Current Status</th>
              <th className="text-center">Change Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{(currentPage - 1) * USERS_PER_PAGE + index + 1}</td>
                <td>
                  <img src={user.user_photo_url} alt="avatar" className="w-10 h-10 rounded-full" />
                </td>
                <td>{user.user_full_name}</td>
                <td>{user.user_email}</td>
                <td>
                  <select
                    className="select select-sm"
                    value={user.user_role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <div className="flex justify-center items-center gap-2">
                    {renderStatusIcon(user.user_status)}
                    <span>{user.user_status}</span>
                  </div>
                </td>
                <td className="text-center">
                  {user.user_status === 'active' ? (
                    <button className="btn btn-xs btn-outline" onClick={() => handleStatusChange(user._id, 'blocked')}>
                      Block
                    </button>
                  ) : (
                    <button className="btn btn-xs btn-outline" onClick={() => handleStatusChange(user._id, 'active')}>
                      Unblock
                    </button>
                  )}
                </td>
                <td className="text-center">
                  <button className="btn btn-sm mr-2" onClick={() => setSelectedRequest(user)}>
                    <FaEye />
                  </button>

                  <button className="btn btn-sm btn-outline btn-error" onClick={() => handleDelete(user._id)}>
                    <FaTrashAlt />
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

      {selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="card bg-base-100 shadow-sm">
              <figure className="px-10 pt-10">
                <img src={selectedRequest.user_photo_url} alt="User Avatar" className="rounded-xl w-32" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{selectedRequest.user_full_name}</h2>
              </div>
              <div className="p-4">
                <p>
                  <strong>User Name:</strong> {selectedRequest.user_full_name}
                </p>
                <p>
                  <strong>User Email:</strong> {selectedRequest.user_email}
                </p>
                <p>
                  <strong>Blood Group:</strong> {selectedRequest.user_blood_group}
                </p>
                <p>
                  <strong>Location:</strong> {selectedRequest.user_governorate}, {selectedRequest.user_city}
                </p>
                <p>
                  <strong>User Role:</strong> {selectedRequest.user_role}
                </p>
                <p>
                  <strong>User Status:</strong> {selectedRequest.user_status}
                </p>
              </div>
              <div className="modal-action">
                <button className="btn btn-neutral m-4" onClick={() => setSelectedRequest(null)}>
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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';
import {
  getMyDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../../services/donationService';

const MyDonationRequests = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  useEffect(() => {
    if (!user?.uid) return;
    getMyDonationRequests(user.uid)
      .then(setRequests)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load requests', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This request will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDonationRequest(id);
          setRequests((prev) => prev.filter((req) => req.id !== id));
          Swal.fire({ icon: 'success', title: 'Deleted', showConfirmButton: false, timer: 1200 });
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
        }
      }
    });
  };

  const handleStatusUpdate = async (id, donation_status) => {
    try {
      await updateDonationRequest(id, { donation_status });
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, donation_status } : req)));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((req) => req.donation_status === filter);

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Donation Requests</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="select select-bordered"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Donor Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.recipient_name}</td>
                  <td>
                    {req.recipient_governorate}, {req.recipient_city}
                  </td>
                  <td>{req.donation_date}</td>
                  <td>{req.donation_time}</td>
                  <td>{req.blood_group}</td>
                  <td className="capitalize">{req.donation_status}</td>
                  <td>
                    {req.donation_status === 'inprogress' && (
                      <div>
                        <p>{req.donor_name}</p>
                        <p className="text-sm">{req.donor_email}</p>
                      </div>
                    )}
                  </td>
                  <td className="flex gap-1 flex-wrap">
                    {req.donation_status === 'inprogress' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'done')}
                          className="btn btn-xs btn-success"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'canceled')}
                          className="btn btn-xs btn-error"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/edit-donation-request/${req.id}`)}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="btn btn-xs btn-outline">
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/donation-details/${req.id}`)}
                      className="btn btn-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? 'btn-neutral' : 'btn-outline'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyDonationRequests;

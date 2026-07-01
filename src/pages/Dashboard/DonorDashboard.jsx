import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';
import {
  getMyDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../services/donationService';

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getMyDonationRequests(user.uid)
      .then((data) => setDonationRequests(data.slice(0, 5)))
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load requests', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateDonationRequest(id, { donation_status: status });
      setDonationRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, donation_status: status } : req)),
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
  };

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
          setDonationRequests((prev) => prev.filter((req) => req.id !== id));
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
        }
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.displayName}!</h1>

      {donationRequests.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Recent Donation Requests</h2>
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
                {donationRequests.map((req) => (
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
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="btn btn-xs btn-outline"
                      >
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate('/dashboard/my-donation-requests')}
              className="btn btn-neutral"
            >
              View My All Requests
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">You have no donation requests yet.</p>
      )}
    </div>
  );
};

export default DonorDashboard;

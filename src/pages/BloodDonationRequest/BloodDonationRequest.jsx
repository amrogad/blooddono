import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { getPendingRequests } from '../../services/donationService';

const BloodDonationRequest = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canCreate = user?.role === 'donor' || user?.role === 'admin';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/home-donation-request-details/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Donation Requests</h2>
        {canCreate && (
          <button
            onClick={() => navigate('/dashboard/create-donation-request')}
            className="btn btn-neutral"
          >
            + New Request
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="card bg-base-100 shadow-md p-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{req.recipient_name}</h3>
                <p>
                  <strong>Location:</strong> {req.recipient_governorate}, {req.recipient_city}
                </p>
                <p>
                  <strong>Blood Group:</strong> {req.blood_group}
                </p>
                <p>
                  <strong>Date:</strong> {req.donation_date}
                </p>
                <p>
                  <strong>Time:</strong> {req.donation_time}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleViewDetails(req.id)}
                  className="btn btn-neutral w-full"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodDonationRequest;

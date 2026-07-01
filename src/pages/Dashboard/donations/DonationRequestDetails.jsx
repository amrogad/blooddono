import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loading from '../../../components/Loading';
import { getDonationRequest } from '../../../services/donationService';

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonationRequest(id)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!request) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="mb-4">We couldn't find a donation request with that id.</p>
        <button className="btn btn-neutral" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Donation Request Details</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Recipient: {request.recipient_name}</h3>
        <p>
          <strong>Requested By:</strong> {request.requester_name} ({request.requester_email})
        </p>
        <p>
          <strong>Location:</strong> {request.recipient_governorate}, {request.recipient_city}
        </p>
        <p>
          <strong>Hospital:</strong> {request.hospital_name}
        </p>
        <p>
          <strong>Address:</strong> {request.full_address}
        </p>
        <p>
          <strong>Blood Group:</strong> {request.blood_group}
        </p>
        <p>
          <strong>Date:</strong> {request.donation_date}
        </p>
        <p>
          <strong>Time:</strong> {request.donation_time}
        </p>
        <p>
          <strong>Status:</strong> <span className="capitalize">{request.donation_status}</span>
        </p>
        <p className="mt-4">
          <strong>Message:</strong> {request.request_message}
        </p>

        {request.donation_status === 'inprogress' && request.donor_name && (
          <div className="mt-4">
            <h4 className="font-semibold">Donor Info:</h4>
            <p>
              <strong>Name:</strong> {request.donor_name}
            </p>
            <p>
              <strong>Email:</strong> {request.donor_email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequestDetails;

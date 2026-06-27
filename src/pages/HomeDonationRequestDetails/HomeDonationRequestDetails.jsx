import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Loading from '../shared/Loading';
import { getDonationRequest, acceptRequest } from '../../services/donationService';

const HomeDonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDonationRequest(id)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDonateConfirm = async () => {
    setSubmitting(true);
    try {
      await acceptRequest(id);
      setModalOpen(false);
      Swal.fire('Success', 'You are now a donor for this request.', 'success');
      navigate('/blood-donation-request');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Could not accept request', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="mb-4">We couldn't find a donation request with that id.</p>
        <button className="btn btn-neutral" onClick={() => navigate('/blood-donation-request')}>
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Donation Request Details</h2>
      <div className="bg-base-100 shadow-md p-4 rounded">
        <p>
          <strong>Recipient Name:</strong> {request.recipient_name}
        </p>
        <p>
          <strong>Location:</strong> {request.recipient_governorate}, {request.recipient_city}
        </p>
        <p>
          <strong>Hospital:</strong> {request.hospital_name}
        </p>
        <p>
          <strong>Full Address:</strong> {request.full_address}
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
          <strong>Request Message:</strong> {request.request_message}
        </p>
        <p>
          <strong>Status:</strong> {request.donation_status}
        </p>
      </div>

      {request.donation_status === 'pending' && (
        <button className="btn btn-neutral mt-6" onClick={() => setModalOpen(true)}>
          Donate Now
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <dialog open className="modal modal-open">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Donation</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.displayName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleDonateConfirm}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Confirm'}
              </button>

              <button type="button" className="btn btn-error" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default HomeDonationRequestDetails;

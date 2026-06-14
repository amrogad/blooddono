import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

// Same sample donation requests used across the dashboard pages.
const sampleRequests = [
  {
    _id: '1',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    hospital_name: 'Cairo University Hospital',
    full_address: '12 El Saleh Ayoub St, Nasr City, Cairo',
    blood_group: 'A+',
    donation_date: '2026-06-20',
    donation_time: '10:00',
    donation_status: 'pending',
    request_message: 'Need a blood donor urgently for a scheduled surgery.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
  {
    _id: '2',
    recipient_name: 'Tarek Aboul Fotouh',
    recipient_governorate: 'Giza',
    recipient_city: '6th of October',
    hospital_name: 'Cairo University Hospital',
    full_address: '4 Central Axis, 6th of October, Giza',
    blood_group: 'O-',
    donation_date: '2026-06-15',
    donation_time: '14:30',
    donation_status: 'inprogress',
    request_message: 'Patient needs O- blood for a transfusion this week.',
    requester_name: 'Sara Mostafa',
    requester_email: 'sara.mostafa@example.com',
  },
  {
    _id: '3',
    recipient_name: 'Yasmin Saeed',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Sidi Gaber',
    hospital_name: 'Alexandria Medical Center',
    full_address: '21 Port Said St, Sidi Gaber, Alexandria',
    blood_group: 'B+',
    donation_date: '2026-05-28',
    donation_time: '09:00',
    donation_status: 'done',
    request_message: 'Thanks to everyone who came forward, donor found.',
    requester_name: 'Karim Hossam',
    requester_email: 'karim.hossam@example.com',
  },
  {
    _id: '4',
    recipient_name: 'Ahmed Sami',
    recipient_governorate: 'Cairo',
    recipient_city: 'Heliopolis',
    hospital_name: 'Cairo University Hospital',
    full_address: '8 Cleopatra St, Heliopolis, Cairo',
    blood_group: 'AB+',
    donation_date: '2026-05-10',
    donation_time: '11:15',
    donation_status: 'canceled',
    request_message: 'Request canceled, patient was discharged early.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
  {
    _id: '5',
    recipient_name: 'Nour El-Din',
    recipient_governorate: 'Giza',
    recipient_city: 'Giza City',
    hospital_name: 'Alexandria Medical Center',
    full_address: '3 Pyramids Rd, Giza City, Giza',
    blood_group: 'O+',
    donation_date: '2026-06-25',
    donation_time: '16:00',
    donation_status: 'pending',
    request_message: 'Looking for an O+ donor for an upcoming procedure.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
];

const HomeDonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const request = sampleRequests.find((req) => req._id === id);

  const handleDonateConfirm = () => {
    setSubmitting(true);

    // No backend yet, just simulate the donation being registered.
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      Swal.fire('Success', 'You are now a donor for this request.', 'success');
      navigate('/blood-donation-request');
    }, 600);
  };

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
        <p><strong>Recipient Name:</strong> {request.recipient_name}</p>
        <p><strong>Location:</strong> {request.recipient_governorate}, {request.recipient_city}</p>
        <p><strong>Hospital:</strong> {request.hospital_name}</p>
        <p><strong>Full Address:</strong> {request.full_address}</p>
        <p><strong>Blood Group:</strong> {request.blood_group}</p>
        <p><strong>Date:</strong> {request.donation_date}</p>
        <p><strong>Time:</strong> {request.donation_time}</p>
        <p><strong>Request Message:</strong> {request.request_message}</p>
        <p><strong>Status:</strong> {request.donation_status}</p>
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
              <p><strong>Name:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-success" onClick={handleDonateConfirm}>
                {submitting ? 'Processing...' : 'Confirm'}
              </button>

              <button className="btn btn-error" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default HomeDonationRequestDetails;

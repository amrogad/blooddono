import React from 'react';
import { useNavigate, useParams } from 'react-router';

// Same sample data shown on the "My Donation Requests" page, kept here so
// the View button has something to load by id.
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

const DonationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const request = sampleRequests.find((req) => req._id === id);

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
        <p><strong>Requested By:</strong> {request.requester_name} ({request.requester_email})</p>
        <p><strong>Location:</strong> {request.recipient_governorate}, {request.recipient_city}</p>
        <p><strong>Hospital:</strong> {request.hospital_name}</p>
        <p><strong>Address:</strong> {request.full_address}</p>
        <p><strong>Blood Group:</strong> {request.blood_group}</p>
        <p><strong>Date:</strong> {request.donation_date}</p>
        <p><strong>Time:</strong> {request.donation_time}</p>
        <p><strong>Status:</strong> <span className="capitalize">{request.donation_status}</span></p>
        <p className="mt-4"><strong>Message:</strong> {request.request_message}</p>

        {/* {request.donation_status === 'inprogress' && request.donor_name && (
          <div className="mt-4">
            <h4 className="font-semibold">Donor Info:</h4>
            <p><strong>Name:</strong> {request.donor_name}</p>
            <p><strong>Email:</strong> {request.donor_email}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DonationRequestDetails;

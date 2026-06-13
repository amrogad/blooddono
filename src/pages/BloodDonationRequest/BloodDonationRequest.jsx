import React from 'react';
import { useNavigate } from 'react-router';

// Sample pending donation requests for the public list
const sampleRequests = [
  {
    _id: '1',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    donation_date: '2026-06-15',
    donation_time: '10:00',
    blood_group: 'A+',
    donation_status: 'pending',
  },
  {
    _id: '4',
    recipient_name: 'Hassan Ibrahim',
    recipient_governorate: 'Cairo',
    recipient_city: 'Heliopolis',
    donation_date: '2026-06-20',
    donation_time: '17:00',
    blood_group: 'AB+',
    donation_status: 'pending',
  },
  {
    _id: '7',
    recipient_name: 'Yasmin Saeed',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Sidi Gaber',
    donation_date: '2026-06-22',
    donation_time: '12:00',
    blood_group: 'B-',
    donation_status: 'pending',
  },
  {
    _id: '8',
    recipient_name: 'Dina Farouk',
    recipient_governorate: 'Dakahlia',
    recipient_city: 'Mansoura',
    donation_date: '2026-06-27',
    donation_time: '15:45',
    blood_group: 'O+',
    donation_status: 'pending',
  },
];

const BloodDonationRequest = () => {
  const navigate = useNavigate();

  // Original page only listed requests with status "pending"
  const requests = sampleRequests.filter((req) => req.donation_status === 'pending');

  const handleViewDetails = (id) => {
    navigate(`/home-donation-request-details/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Pending Blood Donation Requests 🩸</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req._id} className="card bg-base-100 shadow-md p-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{req.recipient_name}</h3>
                <p><strong>Location:</strong> {req.recipient_governorate}, {req.recipient_city}</p>
                <p><strong>Blood Group:</strong> {req.blood_group}</p>
                <p><strong>Date:</strong> {req.donation_date}</p>
                <p><strong>Time:</strong> {req.donation_time}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleViewDetails(req._id)}
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

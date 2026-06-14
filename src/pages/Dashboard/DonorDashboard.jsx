import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const sampleRequests = [
  {
    _id: '1',
    recipient_name: 'Hassan Ibrahim',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    donation_date: '2026-06-15',
    donation_time: '10:00 AM',
    blood_group: 'A+',
    donation_status: 'inprogress',
  },
  {
    _id: '2',
    recipient_name: 'Dina Samir',
    recipient_governorate: 'Giza',
    recipient_city: '6th of October',
    donation_date: '2026-06-08',
    donation_time: '02:30 PM',
    blood_group: 'O-',
    donation_status: 'done',
  },
  {
    _id: '3',
    recipient_name: 'Tarek Younes',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Sidi Gaber',
    donation_date: '2026-06-20',
    donation_time: '09:00 AM',
    blood_group: 'B+',
    donation_status: 'pending',
  },
];

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [donationRequests, setDonationRequests] = useState(sampleRequests);

  const handleStatusUpdate = (id, status) => {
    setDonationRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, donation_status: status } : req))
    );
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This request will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setDonationRequests((prev) => prev.filter((req) => req._id !== id));
      }
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.displayName}</h1>

      {donationRequests.length > 0 && (
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
                  <tr key={req._id}>
                    <td>{req.recipient_name}</td>
                    <td>{req.recipient_governorate}, {req.recipient_city}</td>
                    <td>{req.donation_date}</td>
                    <td>{req.donation_time}</td>
                    <td>{req.blood_group}</td>
                    <td className="capitalize">{req.donation_status}</td>
                    <td>
                      {req.donation_status === 'inprogress' && (
                        <div>
                          <p>{user?.displayName}</p>
                          <p className="text-sm">{user?.email}</p>
                        </div>
                      )}
                    </td>
                    <td className="flex gap-1 flex-wrap">
                      {req.donation_status === 'inprogress' && (
                        <>
                          <button onClick={() => handleStatusUpdate(req._id, 'done')} className="btn btn-xs btn-success">Done</button>
                          <button onClick={() => handleStatusUpdate(req._id, 'canceled')} className="btn btn-xs btn-error">Cancel</button>
                        </>
                      )}
                      <button onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)} className="btn btn-xs btn-info">Edit</button>
                      <button onClick={() => handleDelete(req._id)} className="btn btn-xs btn-outline">Delete</button>
                      <button onClick={() => navigate(`/dashboard/donation-details/${req._id}`)} className="btn btn-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <button onClick={() => navigate('/dashboard/my-donation-requests')} className="btn btn-neutral">
              View My All Requests
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;

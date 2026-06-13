import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

// Sample requests for the demo user (Amro Gad). In a real app this would
// come from the backend, but for now we just keep it in state so the
// delete/status buttons still feel like they do something.
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

const MyDonationRequests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState(sampleRequests);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This request will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  };

  const handleStatusUpdate = (id, donation_status) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, donation_status } : req))
    );
  };

  const filteredRequests =
    filter === 'all' ? requests : requests.filter((req) => req.donation_status === filter);

  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

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
                <tr key={req._id}>
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
                        <p>{req.requester_name}</p>
                        <p className="text-sm">{req.requester_email}</p>
                      </div>
                    )}
                  </td>
                  <td className="flex gap-1 flex-wrap">
                    {req.donation_status === 'inprogress' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'done')}
                          className="btn btn-xs btn-success"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'canceled')}
                          className="btn btn-xs btn-error"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                      className="btn btn-xs btn-info"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="btn btn-xs btn-outline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/donation-details/${req._id}`)}
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

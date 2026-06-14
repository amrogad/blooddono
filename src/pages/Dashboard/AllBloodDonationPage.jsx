import { useState } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useUserRole from '../../hooks/useUserRole';

// Sample donation requests for the demo (would normally come from the backend)
const sampleDonations = [
  {
    _id: '1',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    donation_date: '2026-06-15',
    donation_time: '10:00',
    blood_group: 'A+',
    donation_status: 'pending',
    hospital_name: 'Cairo University Hospital',
    full_address: '12 El Nasr Street, Nasr City, Cairo',
    requester_name: '',
    requester_email: '',
  },
  {
    _id: '2',
    recipient_name: 'Tarek Aboul Fotouh',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Montaza',
    donation_date: '2026-06-18',
    donation_time: '14:30',
    blood_group: 'O-',
    donation_status: 'inprogress',
    hospital_name: 'Alexandria Medical Center',
    full_address: '5 Corniche Road, Montaza, Alexandria',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
  {
    _id: '3',
    recipient_name: 'Yasmin Saeed',
    recipient_governorate: 'Giza',
    recipient_city: '6th of October',
    donation_date: '2026-06-10',
    donation_time: '09:00',
    blood_group: 'B+',
    donation_status: 'done',
    hospital_name: 'Cairo University Hospital',
    full_address: '21 Central Axis, 6th of October, Giza',
    requester_name: 'Sara Hassan',
    requester_email: 'sara.hassan@example.com',
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
    hospital_name: 'Cairo University Hospital',
    full_address: '8 El Higaz Street, Heliopolis, Cairo',
    requester_name: '',
    requester_email: '',
  },
  {
    _id: '5',
    recipient_name: 'Dina Farouk',
    recipient_governorate: 'Dakahlia',
    recipient_city: 'Mansoura',
    donation_date: '2026-05-28',
    donation_time: '11:15',
    blood_group: 'O+',
    donation_status: 'canceled',
    hospital_name: 'Tanta General Hospital',
    full_address: '3 Gomhouria Street, Mansoura, Dakahlia',
    requester_name: '',
    requester_email: '',
  },
  {
    _id: '6',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Maadi',
    donation_date: '2026-06-25',
    donation_time: '08:30',
    blood_group: 'A-',
    donation_status: 'inprogress',
    hospital_name: 'Cairo University Hospital',
    full_address: '17 Road 9, Maadi, Cairo',
    requester_name: 'Karim Fathy',
    requester_email: 'karim.fathy@example.com',
  },
];

const AllBloodDonationPage = () => {
  const { role } = useUserRole();

  const [donations, setDonations] = useState(sampleDonations);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleStatusChange = (id, newStatus) => {
    setDonations((prev) =>
      prev.map((donation) =>
        donation._id === id ? { ...donation, donation_status: newStatus } : donation
      )
    );
    Swal.fire('Success', 'Status updated!', 'success');
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      setDonations((prev) => prev.filter((donation) => donation._id !== id));
      Swal.fire('Deleted!', 'Request deleted.', 'success');
    }
  };

  const filteredDonations =
    filter === 'all'
      ? donations
      : donations.filter((donation) => donation.donation_status === filter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">All Blood Donation Requests</h2>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Recipient Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th className="text-center">Blood Group</th>
              <th className="text-center">Status</th>
              <th>Donor Info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDonations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{donation.recipient_name}</td>
                <td>
                  {donation.recipient_governorate}, {donation.recipient_city}
                </td>
                <td>{donation.donation_date}</td>
                <td>{donation.donation_time}</td>
                <td className="text-center">{donation.blood_group}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={donation.donation_status}
                    onChange={(e) =>
                      handleStatusChange(donation._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
                <td>
                  {donation.donation_status === 'inprogress' && (
                    <div>
                      <p>{donation.requester_name}</p>
                      <p className="text-sm">{donation.requester_email}</p>
                    </div>
                  )}
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => setSelectedRequest(donation)}>
                    <FaEye />
                  </button>
                  {role === 'admin' && (
                    <>
                      <Link
                        to={`/dashboard/admin-edit-donation/${donation._id}`}
                        className="btn btn-sm"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(donation._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="join">
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => setCurrentPage(page + 1)}
              className={`join-item btn ${currentPage === page + 1 ? 'btn-neutral' : 'btn-outline'
                }`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Donation Details</h3>
            <p>
              <strong>Recipient Name:</strong> {selectedRequest.recipient_name}
            </p>
            <p>
              <strong>Location:</strong> {selectedRequest.recipient_governorate},{' '}
              {selectedRequest.recipient_city}
            </p>
            <p>
              <strong>Blood Group:</strong> {selectedRequest.blood_group}
            </p>
            <p>
              <strong>Hospital:</strong> {selectedRequest.hospital_name}
            </p>
            <p>
              <strong>Full Address:</strong> {selectedRequest.full_address}
            </p>
            <p>
              <strong>Donation Date & Time:</strong>{' '}
              {selectedRequest.donation_date} at {selectedRequest.donation_time}
            </p>
            <p>
              <strong>Status:</strong> {selectedRequest.donation_status}
            </p>
            <div className="modal-action">
              <button className="btn btn-neutral" onClick={() => setSelectedRequest(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBloodDonationPage;

import { useEffect, useState } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../shared/Loading';
import {
  getDonationRequests,
  updateDonationRequest,
  deleteDonationRequest,
} from '../../services/donationService';

const AllBloodDonationPage = () => {
  const { role } = useUserRole();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getDonationRequests()
      .then(setDonations)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: 'Could not load requests', text: error.message }),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDonationRequest(id, { donation_status: newStatus });
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === id ? { ...donation, donation_status: newStatus } : donation,
        ),
      );
      Swal.fire('Success', 'Status updated!', 'success');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    }
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
      try {
        await deleteDonationRequest(id);
        setDonations((prev) => prev.filter((donation) => donation.id !== id));
        Swal.fire('Deleted!', 'Request deleted.', 'success');
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Delete failed', text: error.message });
      }
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

  if (loading) return <Loading />;

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
              <tr key={donation.id}>
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
                    onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                    disabled={role !== 'admin'}
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
                      <p>{donation.donor_name}</p>
                      <p className="text-sm">{donation.donor_email}</p>
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
                        to={`/dashboard/admin-edit-donation/${donation.id}`}
                        className="btn btn-sm"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(donation.id)}
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
              className={`join-item btn ${
                currentPage === page + 1 ? 'btn-neutral' : 'btn-outline'
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
              <strong>Donation Date & Time:</strong> {selectedRequest.donation_date} at{' '}
              {selectedRequest.donation_time}
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

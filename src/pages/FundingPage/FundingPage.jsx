import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const sampleFunds = [
  { _id: '1', name: 'Ahmed Mostafa', email: 'ahmed.mostafa@example.com', amount: 50, paid_at: '2026-05-02T10:15:00' },
  { _id: '2', name: 'Sara Hassan', email: 'sara.hassan@example.com', amount: 100, paid_at: '2026-05-10T14:30:00' },
  { _id: '3', name: 'Mohamed Ali', email: 'mohamed.ali@example.com', amount: 25, paid_at: '2026-05-18T09:00:00' },
  { _id: '4', name: 'Nourhan Tarek', email: 'nourhan.tarek@example.com', amount: 75, paid_at: '2026-05-25T16:45:00' },
  { _id: '5', name: 'Youssef Adel', email: 'youssef.adel@example.com', amount: 200, paid_at: '2026-06-01T11:20:00' },
  { _id: '6', name: 'Mona Khaled', email: 'mona.khaled@example.com', amount: 40, paid_at: '2026-06-05T13:10:00' },
];

const FundingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFunds = sampleFunds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sampleFunds.length / itemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Funding Records</h2>
        <button
          className="btn bg-[#ff4136]"
          onClick={() => navigate('/funds/payment')}
        >
          Give Fund
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {currentFunds.map((fund, index) => (
              <tr key={fund._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{fund.name}</td>
                <td>{fund.email}</td>
                <td>{fund.amount} EGP</td>
                <td>{new Date(fund.paid_at).toLocaleDateString('en-GB')}</td>
                <td>{new Date(fund.paid_at).toLocaleTimeString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="join">
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              className={`join-item btn ${currentPage === num + 1 ? 'btn-neutral' : 'btn-outline'
                }`}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundingPage;

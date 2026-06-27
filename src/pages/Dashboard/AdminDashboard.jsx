import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUsers, FaHandHoldingUsd, FaTint } from 'react-icons/fa';
import { getAllProfiles } from '../../services/profileService';
import { getDonationRequests } from '../../services/donationService';
import { getFundsTotal } from '../../services/fundService';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({ totalUsers: 0, totalRequests: 0, totalFunds: 0 });

  useEffect(() => {
    Promise.all([getAllProfiles(), getDonationRequests(), getFundsTotal()])
      .then(([users, requests, fundsTotal]) =>
        setStats({
          totalUsers: users.length,
          totalRequests: requests.length,
          totalFunds: fundsTotal,
        }),
      )
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.displayName}!</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="card bg-white shadow-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <FaUsers className="text-4xl text-blue-500" />
            <div>
              <p className="text-xl font-semibold">{stats.totalUsers}</p>
              <p className="text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        {/* Total Funding */}
        <div className="card bg-white shadow-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <FaHandHoldingUsd className="text-4xl text-green-500" />
            <div>
              <p className="text-xl font-semibold">{stats.totalFunds.toLocaleString()} EGP</p>
              <p className="text-gray-600">Total Funding</p>
            </div>
          </div>
        </div>

        {/* Total Blood Donation Requests */}
        <div className="card bg-white shadow-xl p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <FaTint className="text-4xl text-red-500" />
            <div>
              <p className="text-xl font-semibold">{stats.totalRequests}</p>
              <p className="text-gray-600">Blood Requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

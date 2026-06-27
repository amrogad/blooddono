import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { FaTint, FaRegEdit } from 'react-icons/fa';

const VolunteerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-2">Welcome, {user?.displayName}!</h2>
      <p className="text-gray-600 mb-6">
        As a volunteer you can review blood donation requests and help manage published content.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/all-blood-donation-request"
          className="card bg-white shadow-xl p-6 rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center gap-4">
            <FaTint className="text-4xl text-red-500" />
            <div>
              <p className="text-xl font-semibold">Blood Donation Requests</p>
              <p className="text-gray-600">Review and track all requests</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/content-management-page"
          className="card bg-white shadow-xl p-6 rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center gap-4">
            <FaRegEdit className="text-4xl text-blue-500" />
            <div>
              <p className="text-xl font-semibold">Content Management</p>
              <p className="text-gray-600">Create and edit blog posts</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

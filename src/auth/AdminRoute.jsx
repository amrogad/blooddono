import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading';

const AdminRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;

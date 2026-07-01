import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading';

const MultiRoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const { role, loading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default MultiRoleRoute;

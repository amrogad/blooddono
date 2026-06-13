import { Navigate } from 'react-router';
import { use } from 'react';
import { AuthContext } from './AuthProvider';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/shared/Loading';

const AdminRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const { role, loading: roleLoading } = useUserRole(user?.email);

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

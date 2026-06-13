import { Navigate, useLocation } from 'react-router';
import { use } from 'react';
import { AuthContext } from './AuthProvider';
import Loading from '../pages/shared/Loading';

const PrivateRoute = ({ children }) => {
    const { user, loading } = use(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading></Loading>;
    }

    if (!user) {
        return <Navigate to="/login" state={location.pathname} replace />;
    }

    return children;
};

export default PrivateRoute;

import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import Loading from '../pages/shared/Loading';
import useAuthBootstrap from '../hooks/useAuthBootstrap';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);
    const location = useLocation();
    useAuthBootstrap();

    if (loading) {
        return <Loading></Loading>;
    }

    if (!user) {
        return <Navigate to="/login" state={location.pathname} replace />;
    }

    return children;
};

export default PrivateRoute;

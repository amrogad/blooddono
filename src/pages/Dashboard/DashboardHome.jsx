import useUserRole from '../../hooks/useUserRole';
import Loading from '../../components/Loading';
import DonorDashboard from './DonorDashboard';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../../components/Forbidden';

const DashboardHome = () => {
  const { role, loading: roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading></Loading>;
  }
  if (role === 'user') {
    return <DonorDashboard></DonorDashboard>;
  } else if (role === 'admin') {
    return <AdminDashboard></AdminDashboard>;
  } else {
    return <Forbidden></Forbidden>;
  }
};

export default DashboardHome;

import React from 'react';
import useUserRole from '../../hooks/useUserRole';
import Loading from '../shared/Loading';
import DonorDashboard from './DonorDashboard';
import { useSelector } from 'react-redux';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../shared/Forbidden';

const DashboardHome = () => {

    const { user } = useSelector((state) => state.auth);

    const { role, loading: roleLoading } = useUserRole(user?.email);

    if (roleLoading) {
        return <Loading></Loading>;
    }
    if (role === 'donor') {
        return <DonorDashboard></DonorDashboard>
    }
    else if (role === 'admin' || role === 'volunteer') {
        return <AdminDashboard></AdminDashboard>
    }
    else {
        return <Forbidden></Forbidden>
    }
};

export default DashboardHome;
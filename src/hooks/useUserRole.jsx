import { useSelector } from 'react-redux';

const useUserRole = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return {
    role: user?.role,
    loading,
    error: null,
  };
};

export default useUserRole;

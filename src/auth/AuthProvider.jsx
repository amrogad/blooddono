import useAuthBootstrap from '../hooks/useAuthBootstrap';

const AuthProvider = ({ children }) => {
  useAuthBootstrap();
  return children;
};

export default AuthProvider;

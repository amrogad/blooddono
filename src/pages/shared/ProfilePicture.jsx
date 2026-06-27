import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../services/authService';
import { setRole } from '../../redux/authSlice';
import Swal from 'sweetalert2';

const ProfilePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Sign out failed', text: error.message });
      return;
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="m-1">
        <div className="tooltip tooltip-left" data-tip={user.displayName}>
          <img
            className="w-[40px] h-[40px] rounded-full border-2 border-zinc-400"
            src={`${user.photoURL ? user.photoURL : '/images/developer-avatar.jpg'}`}
            alt=""
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {user && (
          <Link to="/dashboard">
            <li>
              <p className="btn btn-neutral btn-outline hover:text-white mb-2 w-full">Dashboard</p>
            </li>
          </Link>
        )}

        <li className="menu-title pt-2 text-xs text-gray-400">Demo role</li>
        {['admin', 'donor', 'volunteer'].map((r) => (
          <li key={r}>
            <button
              onClick={() => dispatch(setRole(r))}
              className={`capitalize ${user.role === r ? 'font-bold text-[#ff4136]' : ''}`}
            >
              {r}
            </button>
          </li>
        ))}

        <li className="mt-2">
          <p className="btn btn-error btn-outline hover:text-white w-full" onClick={handleLogOut}>
            Logout
          </p>
        </li>
      </ul>
    </div>
  );
};

export default ProfilePicture;

import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logOut, setRole } from '../../redux/authSlice';

const ProfilePicture = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogOut = () => {
        dispatch(logOut());
        localStorage.removeItem("token");
        navigate('/');
    }

    const roles = ['admin', 'donor', 'volunteer'];

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1">
                <div className="tooltip tooltip-left" data-tip={user.displayName}>
                    <img className="w-[40px] h-[40px] rounded-full border-2 border-zinc-400" src={`${user.photoURL ? user.photoURL : "/images/developer-avatar.jpg"}`} alt="" />
                </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {
                    user && <Link to='/dashboard'><li>

                        <p className='btn btn-neutral btn-outline hover:text-white mb-2 w-full'>Dashboard</p>

                    </li></Link>
                }

                <li className="menu-title">Demo role</li>
                {roles.map((r) => (
                    <li key={r}>
                        <button
                            type="button"
                            className={`btn btn-sm w-full mb-1 ${user.role === r ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => dispatch(setRole(r))}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    </li>
                ))}

                <li><p className='btn btn-error btn-outline hover:text-white' onClick={handleLogOut}>Logout</p></li>
            </ul>
        </div>
    );
};

export default ProfilePicture;
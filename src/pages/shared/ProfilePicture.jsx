import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';

const ProfilePicture = () => {

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    }

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

                <li><p className='btn btn-error btn-outline hover:text-white' onClick={handleLogOut}>Logout</p></li>
            </ul>
        </div>
    );
};

export default ProfilePicture;

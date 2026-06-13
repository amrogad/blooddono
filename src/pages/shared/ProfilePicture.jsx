import React, { use } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../provider/AuthProvider';
import Swal from 'sweetalert2';

const ProfilePicture = () => {

    const navigate = useNavigate();
    const { user, logOut } = use(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                localStorage.removeItem("token");
                navigate('/');
            }).catch((error) => {
                // toast.error(`ERROR - ${error.message} `);
                Swal.fire({
                    icon: "error",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    }

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1">
                <div className="tooltip tooltip-left" data-tip={user.displayName}>
                    <img className="w-[40px] h-[40px] rounded-full border-2 border-zinc-400" src={`${user.photoURL ? user.photoURL : "https://i.ibb.co/bjvNNZsL/developer-512.jpg"}`} alt="" />
                </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                {/* <li><p className='btn btn-outline  btn-neutral btn-active mb-2'>{user.displayName ? user.displayName : "¯\\_(ツ)_/¯"}</p></li> */}
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
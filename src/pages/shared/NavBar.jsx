import { useState } from 'react';
import NavLinks from './NavLinks';
import RegistrationButtons from './RegistrationButtons';
import { Link, NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import ProfilePicture from './ProfilePicture';

import { HiMenu } from "react-icons/hi";
import { RiCloseLargeFill } from "react-icons/ri";

const NavBar = () => {

    const { user } = useSelector((state) => state.auth);
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <div className='max-w-[1600px] mx-auto p-4 border-b border-b-[#ff4136]'>
            <div className='flex gap-2 flex-row justify-between items-center px-4 py-2'>
                <Link to="/" className="flex items-center">
                    <span className="text-3xl font-extrabold">
                        Blood<span className="text-[#ff4136]">Dono</span>
                    </span>
                </Link>

                <div className='hidden lg:flex'>
                    <NavLinks></NavLinks>
                </div>

                <div className='flex justify-center items-center gap-4'>
                    {
                        user ? <ProfilePicture></ProfilePicture> : <RegistrationButtons></RegistrationButtons>
                    }

                    <div className='flex flex-col lg:hidden'>
                        <button
                            type="button"
                            onClick={() => setOpenMenu(!openMenu)}
                            aria-expanded={openMenu}
                            aria-label="Toggle menu"
                            className="lg:hidden"
                        >
                            {
                                openMenu ? <RiCloseLargeFill className='text-3xl' /> : <HiMenu className='text-3xl' />
                            }
                        </button>

                        <div className={`z-100 lg:hidden absolute flex flex-col justify-end duration-800 gap-2 rounded-md p-4 border border-gray-300 bg-white ${openMenu ? 'top-20 right-4' : '-top-130 right-4'}`}>

                            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/">Home</NavLink>
                            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/search">Search</NavLink>
                            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/blood-donation-request">Donation Request</NavLink>
                            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/blogs">Blogs</NavLink>
                            {
                                user && <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/funds">Funds</NavLink>
                            }
                            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/about-us">About Us</NavLink>

                            <Link to="/register">
                                <button className=' w-full text-white hover:cursor-pointer bg-black font-bold text-xl px-6 py-3 rounded-sm border-2 border-black hover:border-[#ff4136] '>Register</button>
                            </Link>

                            <Link to="/login">
                                <button className='w-full mr-6 border-2 border-[#ff4136] hover:border-[#333333]  hover:cursor-pointer font-bold text-xl px-6 py-3 rounded-sm bg-[#ff4136]'>Login</button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NavBar;
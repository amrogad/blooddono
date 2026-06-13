import React from 'react';
import { Link } from 'react-router';

const RegistrationButtons = () => {
    return (
        <div className='hidden lg:flex justify-center items-center gap-4'>
            <Link to="/register">
                <button className='mr-6 border-2 border-[#ff4136] hover:border-[#333333]  hover:cursor-pointer font-bold text-xl px-6 py-3 rounded-sm bg-[#ff4136]'>Register</button>
            </Link>

            <Link to="/login">
                <button className='text-white hover:cursor-pointer bg-black font-bold text-xl px-6 py-3 rounded-sm border-2 border-black hover:border-[#ff4136] '>Login</button>
            </Link>
        </div>
    );
};

export default RegistrationButtons;
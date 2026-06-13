import React from 'react';
import { Link } from 'react-router';


import { FaArrowRightLong } from "react-icons/fa6";

import { MdBloodtype } from "react-icons/md";
import { BiSolidDonateBlood } from "react-icons/bi";
import { TbLogs } from "react-icons/tb";
import { BiSolidDonateHeart } from "react-icons/bi";
import { FaHospitalUser } from "react-icons/fa6";
import { TbLocationHeart } from "react-icons/tb";


const PopularPages = () => {
    return (
        <div className='p-4 my-8'>

            <h1 className='text-5xl font-semibold mb-8'>Popular Pages</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>

                {/* First  */}
                <div className='flex justify-between items-center border-t-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <MdBloodtype className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>Search Blood Group </p>
                    </div>

                    <Link to="/search">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>

                {/* second  */}
                <div className='flex justify-between items-center border-t-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <BiSolidDonateBlood className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>All Donation Request</p>
                    </div>

                    <Link to="/blood-donation-request">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>


                {/* third  */}
                <div className='flex justify-between items-center border-t-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <TbLogs className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>All Blogs</p>
                    </div>

                    <Link to="/blogs">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>

                {/* 4th  */}
                <div className='flex justify-between items-center border-y-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <BiSolidDonateHeart className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>Can I Donate?</p>
                    </div>

                    <Link to="/blogs/687b8692af64353d8b977162">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>

                {/* 5th  */}
                <div className='flex justify-between items-center border-y-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <FaHospitalUser className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>Why Do Donors Give?</p>
                    </div>

                    <Link to="/blogs/68a578439e191e7b485dc319">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>


                {/* 6th  */}
                <div className='flex justify-between items-center border-y-2 py-4 border-gray-300 mx-4'>
                    <div className='flex justify-center items-center gap-2'>
                        <TbLocationHeart className='text-4xl text-[#ff4136]' />
                        <p className='text-lg'>Blood Donation Eligibility</p>
                    </div>

                    <Link to="/blogs/68a57a4f9e191e7b485dc31a">
                        <FaArrowRightLong className='text-2xl text-[#ff4136]' />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PopularPages;
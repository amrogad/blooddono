import React from 'react';
import { Link } from 'react-router';

import { FaArrowRightLong } from "react-icons/fa6";


const BeADonor = () => {
    return (
        <div className='p-4 my-8'>
            <div className='flex justify-between items-center gap-4'>
                <div className='w-full md:w-1/2'>
                    <img src="https://i.ibb.co/RkvFR3nW/blood-hero.png" alt="" />
                </div>
                <div className='w-full md:w-1/2'>
                    <h3 className='text-5xl font-semibold'>Be a Donor !</h3>
                    <p className='text-xl text-justify my-8'>
                        Donating blood is one of the simplest yet most powerful ways to save lives. Every donation has the potential to help accident victims, cancer patients, and mothers during childbirth. Imagine knowing that your small act could be the reason someone gets a second chance at life. By joining our team, you become part of a caring community dedicated to making a real difference. Together, we can ensure that blood is always available when it's needed most. Be a hero—donate today!
                    </p>

                    <div className=' flex my-4'>
                        <Link to="/login" className='btn bg-[#ff4136] px-16 text-lg'>
                            Join Now
                            <FaArrowRightLong className='text-xl' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeADonor; 
import React from 'react';

import { TbDeviceMobilePlus } from "react-icons/tb";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoPeopleOutline } from "react-icons/io5";
import { MdMarkEmailRead } from "react-icons/md";

const AverageUsers = () => {
    return (
        <div className='p-4 my-8'>
            <h1 className='text-5xl font-semibold mb-8'>
                Average per Month in 2024
            </h1>
            <p className='text-lg text-justify mb-4'>
                In 2024, the monthly average gives a clear picture of consistency and progress across the year. It smooths out highs and lows, helping track trends in donations, spending, or productivity. This measure makes it easier to set realistic goals, monitor growth, and ensure steady improvement. By focusing on monthly averages, individuals and organizations can better understand overall performance and make informed decisions that support long-term success.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8'>
                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure className="px-10 pt-10">
                        <TbDeviceMobilePlus className='text-9xl text-[#ff4136]' />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h3 className='text-3xl'>315,500</h3>
                    <p className='text-2xl'>Visits</p>
                    </div>
                </div>

                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure className="px-10 pt-10">
                        <IoPeopleOutline className='text-9xl text-[#ff4136]' />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h3 className='text-3xl'>10,000</h3>
                    <p className='text-2xl'>New Members</p>
                    </div>
                </div>

                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure className="px-10 pt-10">
                        <FaPeopleGroup className='text-9xl text-[#ff4136]' />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h3 className='text-3xl'>32,000</h3>
                    <p className='text-2xl'>Active Members</p>
                    </div>
                </div>

                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure className="px-10 pt-10">
                        <MdMarkEmailRead className='text-9xl text-[#ff4136]' />
                    </figure>
                    <div className="card-body items-center text-center">
                        <h3 className='text-3xl'>1,001,000</h3>
                    <p className='text-2xl'>Message Sent</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AverageUsers;
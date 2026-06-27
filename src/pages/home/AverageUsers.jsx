import { TbDeviceMobilePlus } from 'react-icons/tb';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoPeopleOutline } from 'react-icons/io5';
import { MdMarkEmailRead } from 'react-icons/md';

const AverageUsers = () => {
  return (
    <div className="p-4 my-8">
      <h1 className="text-5xl font-semibold mb-8">Our Impact So Far</h1>
      <p className="text-lg text-justify mb-4">
        Behind every number is a person who needed help and a donor who showed up. These figures
        capture the reach of our community so far &mdash; people who visited to learn about
        donation, members who created donor accounts, donors actively ready to help, and the
        requests we have helped connect. Together they show how a simple act, repeated by many, adds
        up to real lives saved.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-8">
        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
          <figure className="px-10 pt-10">
            <TbDeviceMobilePlus className="text-9xl text-[#ff4136]" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="text-4xl font-bold text-[#ff4136]">315,500</h3>
            <p className="text-2xl">Visits</p>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
          <figure className="px-10 pt-10">
            <IoPeopleOutline className="text-9xl text-[#ff4136]" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="text-4xl font-bold text-[#ff4136]">10,000</h3>
            <p className="text-2xl">New Members</p>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
          <figure className="px-10 pt-10">
            <FaPeopleGroup className="text-9xl text-[#ff4136]" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="text-4xl font-bold text-[#ff4136]">32,000</h3>
            <p className="text-2xl">Active Members</p>
          </div>
        </div>

        <div className="card bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
          <figure className="px-10 pt-10">
            <MdMarkEmailRead className="text-9xl text-[#ff4136]" />
          </figure>
          <div className="card-body items-center text-center">
            <h3 className="text-4xl font-bold text-[#ff4136]">1,001,000</h3>
            <p className="text-2xl">Message Sent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AverageUsers;

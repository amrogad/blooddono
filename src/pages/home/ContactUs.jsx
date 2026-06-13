import React from 'react';
import Swal from 'sweetalert2';

const ContactUs = () => {

    const handleSend = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Message sent!',
            showConfirmButton: false,
            timer: 1500
        });
    }

    return (
        <div className='p-4'>
            <h1 className='text-5xl font-semibold mb-8'>Contact Us</h1>

            <div className='flex justify-center items-center'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8'>

                    <div className='col-span-2 flex justify-between items-center gap-2 h-full'>

                        <div className='grid grid-cols-1  md:grid-cols-2 gap-4 lg:gap-8 my-8'>

                            <div className="card shadow-sm bg-gray-50">
                                <div className="card-body">
                                    <h2 className="card-title">Physical Address</h2>

                                    <p>BloodDono</p>
                                    <p>123 Tahrir Street</p>
                                    <p>Cairo, Egypt</p>

                                </div>
                            </div>

                            <div className="card bg-gray-50 shadow-sm">

                                <div className="card-body">
                                    <h2 className="card-title">Postal Address</h2>

                                    <p>BloodDono</p>
                                    <p>123 Tahrir Street</p>
                                    <p>Cairo, Egypt</p>

                                </div>
                            </div>

                            <div className="card bg-gray-50 shadow-sm">

                                <div className="card-body">
                                    <h2 className="card-title"> General Enquiries & Blood Operations</h2>
                                    <p>Email: support@blooddono.com</p>
                                    <p>Phone: 1234 567 890</p>
                                    <p>or +12 3 4567 8901</p>
                                </div>
                            </div>

                            <div className="card bg-gray-50 shadow-sm">

                                <div className="card-body">
                                    <h2 className="card-title">Media and news enquiries</h2>

                                    <p>Email: support@blooddono.com</p>
                                    <p>Phone: 1234 567 890</p>
                                    <p>or +12 3 4567 8901</p>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-span-2 h-full'>
                        <div className='flex-col justify-centre items-center'>
                            <h1 className='text-4xl text-center font-semibold lg:mt-8'>Email</h1>

                            <div className="card w-full">
                                <div className="card-body">
                                    <form onSubmit={handleSend} className="fieldset">
                                        <label className="label">Email</label>
                                        <input type="email" className="input w-full bg-white" placeholder="Email" />
                                        <br />

                                        <label className="label">Message</label>
                                        <textarea type="text" className="textarea h-24 w-full bg-white" placeholder="Message"></textarea>
                                        <br />

                                        <button type="submit" className='bg-white px-8 py-4 text-xl rounded-sm hover:cursor-pointer border-1'>
                                            Send Email
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

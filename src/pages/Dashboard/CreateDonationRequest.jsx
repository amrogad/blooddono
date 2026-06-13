import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import { use } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import { useNavigate } from 'react-router';

const CreateDonationRequest = () => {

    const { user } = use(AuthContext);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setValue('requester_name', user?.displayName);
            setValue('requester_email', user?.email);
        }
    }, [user, setValue]);

    const selectedGovernorate = governorates.find(g => g.name === watch('recipient_governorate'));
    const filteredCities = cities.filter(c => c.governorate_id === selectedGovernorate?.id);

    const onSubmit = (data) => {
        // No backend yet, just pretend the request was saved.
        const request = {
            ...data,
            donation_status: 'pending',
            created_at: new Date().toISOString(),
        };
        console.log('new donation request', request);

        Swal.fire({
            icon: 'success',
            title: 'Donation Request Created!',
            text: 'Your donation request has been submitted.',
            timer: 1800,
            showConfirmButton: false,
        });

        navigate('/dashboard/my-donation-requests');
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6">Create Donation Request</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="label">Requester Name</label>
                    <input type="text" className="input input-bordered w-full" {...register('requester_name')} disabled />
                </div>

                <div>
                    <label className="label">Requester Email</label>
                    <input type="email" className="input input-bordered w-full" {...register('requester_email')} disabled />
                </div>

                <div className="md:col-span-2">
                    <label className="label">Recipient Name</label>
                    <input type="text" className="input input-bordered w-full" {...register('recipient_name', { required: true })} />
                    {errors.recipient_name && <p className="text-red-500 text-sm">Recipient name is required</p>}
                </div>

                <div>
                    <label className="label">Recipient Governorate</label>
                    <select {...register('recipient_governorate', { required: true })} className="select select-bordered w-full">
                        <option value="">Select Governorate</option>
                        {governorates.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                    </select>
                    {errors.recipient_governorate && <p className="text-red-500 text-sm">Governorate is required</p>}
                </div>

                <div>
                    <label className="label">Recipient City</label>
                    <select {...register('recipient_city', { required: true })} className="select select-bordered w-full">
                        <option value="">Select City</option>
                        {filteredCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    {errors.recipient_city && <p className="text-red-500 text-sm">City is required</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="label">Hospital Name</label>
                    <input type="text" className="input input-bordered w-full" {...register('hospital_name', { required: true })} />
                </div>

                <div className="md:col-span-2">
                    <label className="label">Full Address</label>
                    <input type="text" className="input input-bordered w-full" {...register('full_address', { required: true })} />
                </div>

                <div>
                    <label className="label">Blood Group</label>
                    <select {...register('blood_group', { required: true })} className="select select-bordered w-full">
                        <option value="">Select</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label">Donation Date</label>
                    <input type="date" className="input input-bordered w-full" {...register('donation_date', { required: true })} />
                </div>

                <div>
                    <label className="label">Donation Time</label>
                    <input type="time" className="input input-bordered w-full" {...register('donation_time', { required: true })} />
                </div>

                <div className="md:col-span-2">
                    <label className="label">Request Message</label>
                    <textarea className="textarea textarea-bordered w-full" rows="4" {...register('request_message', { required: true })}></textarea>
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="btn btn-neutral w-full">Request</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDonationRequest;

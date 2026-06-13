import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';

// Same sample requests as AllBloodDonationPage, with the extra fields the edit form needs
const sampleDonations = [
  {
    _id: '1',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    donation_date: '2026-06-15',
    donation_time: '10:00',
    blood_group: 'A+',
    donation_status: 'pending',
    hospital_name: 'Cairo University Hospital',
    full_address: '12 El Nasr Street, Nasr City, Cairo',
    request_message: 'Patient needs A+ blood for scheduled surgery.',
  },
  {
    _id: '2',
    recipient_name: 'Tarek Aboul Fotouh',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Montaza',
    donation_date: '2026-06-18',
    donation_time: '14:30',
    blood_group: 'O-',
    donation_status: 'inprogress',
    hospital_name: 'Alexandria Medical Center',
    full_address: '5 Corniche Road, Montaza, Alexandria',
    request_message: 'Urgent O- needed after a road accident.',
  },
  {
    _id: '3',
    recipient_name: 'Yasmin Saeed',
    recipient_governorate: 'Giza',
    recipient_city: '6th of October',
    donation_date: '2026-06-10',
    donation_time: '09:00',
    blood_group: 'B+',
    donation_status: 'done',
    hospital_name: 'Cairo University Hospital',
    full_address: '21 Central Axis, 6th of October, Giza',
    request_message: 'Donation completed, thanks to the donor.',
  },
  {
    _id: '4',
    recipient_name: 'Hassan Ibrahim',
    recipient_governorate: 'Cairo',
    recipient_city: 'Heliopolis',
    donation_date: '2026-06-20',
    donation_time: '17:00',
    blood_group: 'AB+',
    donation_status: 'pending',
    hospital_name: 'Cairo University Hospital',
    full_address: '8 El Higaz Street, Heliopolis, Cairo',
    request_message: 'Needed before kidney dialysis session.',
  },
  {
    _id: '5',
    recipient_name: 'Dina Farouk',
    recipient_governorate: 'Dakahlia',
    recipient_city: 'Mansoura',
    donation_date: '2026-05-28',
    donation_time: '11:15',
    blood_group: 'O+',
    donation_status: 'canceled',
    hospital_name: 'Tanta General Hospital',
    full_address: '3 Gomhouria Street, Mansoura, Dakahlia',
    request_message: 'Request canceled, patient already discharged.',
  },
  {
    _id: '6',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Maadi',
    donation_date: '2026-06-25',
    donation_time: '08:30',
    blood_group: 'A-',
    donation_status: 'inprogress',
    hospital_name: 'Cairo University Hospital',
    full_address: '17 Road 9, Maadi, Cairo',
    request_message: 'Second donation request for the same patient.',
  },
];

const AdminEditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  // Find the matching sample request, fall back to the first one so the form never breaks
  const donationData = sampleDonations.find((d) => d._id === id) || sampleDonations[0];

  useEffect(() => {
    if (donationData) {
      for (let key in donationData) {
        if (Object.prototype.hasOwnProperty.call(donationData, key)) {
          setValue(key, donationData[key]);
        }
      }
    }
  }, [donationData, setValue]);

  const selectedGovernorate = governorates.find(d => d.name === watch('recipient_governorate'));
  const filteredCities = cities.filter(c => c.governorate_id === selectedGovernorate?.id);

  const onSubmit = (data) => {
    console.log('updated donation request', data);
    Swal.fire('Updated', 'Donation request updated successfully!', 'success');
    navigate('/dashboard/all-blood-donation-request');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Edit Donation Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="label">Recipient Name</label>
          <input type="text" className="input input-bordered w-full" {...register('recipient_name', { required: true })} />
          {errors.recipient_name && <p className="text-red-500 text-sm">Recipient name is required</p>}
        </div>

        <div>
          <label className="label">Recipient Governorate</label>
          <select {...register('recipient_governorate', { required: true })} className="select select-bordered w-full">
            <option value="">Select Governorate</option>
            {governorates.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Recipient City</label>
          <select {...register('recipient_city', { required: true })} className="select select-bordered w-full">
            <option value="">Select City</option>
            {filteredCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Hospital Name</label>
          <input type="text" className="input input-bordered w-full" {...register('hospital_name', { required: true })} />
        </div>

        <div className="md:col-span-2">
          <label className="label">Full Address</label>
          <input type="text" className="input input-bordered w-full" {...register('full_address', { required: true })} />
        </div>

        <div className="md:col-span-2">
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
          <button type="submit" className="btn btn-neutral w-full">Update Request</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditDonationRequest;

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';

// Same sample data as the other donation request pages. Defined at module
// level so `.find()` below returns a stable reference between renders
// (otherwise the setValue effect would re-run on every render).
const sampleRequests = [
  {
    _id: '1',
    recipient_name: 'Mona Khaled',
    recipient_governorate: 'Cairo',
    recipient_city: 'Nasr City',
    hospital_name: 'Cairo University Hospital',
    full_address: '12 El Saleh Ayoub St, Nasr City, Cairo',
    blood_group: 'A+',
    donation_date: '2026-06-20',
    donation_time: '10:00',
    donation_status: 'pending',
    request_message: 'Need a blood donor urgently for a scheduled surgery.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
  {
    _id: '2',
    recipient_name: 'Tarek Aboul Fotouh',
    recipient_governorate: 'Giza',
    recipient_city: '6th of October',
    hospital_name: 'Cairo University Hospital',
    full_address: '4 Central Axis, 6th of October, Giza',
    blood_group: 'O-',
    donation_date: '2026-06-15',
    donation_time: '14:30',
    donation_status: 'inprogress',
    request_message: 'Patient needs O- blood for a transfusion this week.',
    requester_name: 'Sara Mostafa',
    requester_email: 'sara.mostafa@example.com',
  },
  {
    _id: '3',
    recipient_name: 'Yasmin Saeed',
    recipient_governorate: 'Alexandria',
    recipient_city: 'Sidi Gaber',
    hospital_name: 'Alexandria Medical Center',
    full_address: '21 Port Said St, Sidi Gaber, Alexandria',
    blood_group: 'B+',
    donation_date: '2026-05-28',
    donation_time: '09:00',
    donation_status: 'done',
    request_message: 'Thanks to everyone who came forward, donor found.',
    requester_name: 'Karim Hossam',
    requester_email: 'karim.hossam@example.com',
  },
  {
    _id: '4',
    recipient_name: 'Ahmed Sami',
    recipient_governorate: 'Cairo',
    recipient_city: 'Heliopolis',
    hospital_name: 'Cairo University Hospital',
    full_address: '8 Cleopatra St, Heliopolis, Cairo',
    blood_group: 'AB+',
    donation_date: '2026-05-10',
    donation_time: '11:15',
    donation_status: 'canceled',
    request_message: 'Request canceled, patient was discharged early.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
  {
    _id: '5',
    recipient_name: 'Nour El-Din',
    recipient_governorate: 'Giza',
    recipient_city: 'Giza City',
    hospital_name: 'Alexandria Medical Center',
    full_address: '3 Pyramids Rd, Giza City, Giza',
    blood_group: 'O+',
    donation_date: '2026-06-25',
    donation_time: '16:00',
    donation_status: 'pending',
    request_message: 'Looking for an O+ donor for an upcoming procedure.',
    requester_name: 'Amro Gad',
    requester_email: 'amro@blooddono.com',
  },
];

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const donationData = sampleRequests.find((req) => req._id === id);

  useEffect(() => {
    if (donationData) {
      Object.entries(donationData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [donationData, setValue]);

  const selectedGovernorate = governorates.find(g => g.name === watch('recipient_governorate'));
  const filteredCities = cities.filter(c => c.governorate_id === selectedGovernorate?.id);

  const onSubmit = () => {
    // No backend yet, just pretend the update was saved.
    Swal.fire('Updated', 'Donation request updated successfully!', 'success');
    navigate('/dashboard/my-donation-requests');
  };

  if (!donationData) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="mb-4">We couldn't find a donation request with that id.</p>
        <button className="btn btn-neutral" onClick={() => navigate('/dashboard/my-donation-requests')}>
          Back to My Requests
        </button>
      </div>
    );
  }

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
            {governorates.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
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

export default EditDonationRequest;

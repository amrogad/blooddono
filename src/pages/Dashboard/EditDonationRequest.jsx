import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import Loading from '../shared/Loading';
import { getDonationRequest, updateDonationRequest } from '../../services/donationService';

const EDITABLE_FIELDS = [
  'recipient_name',
  'recipient_governorate',
  'recipient_city',
  'hospital_name',
  'full_address',
  'blood_group',
  'donation_date',
  'donation_time',
  'request_message',
];

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDonationRequest(id)
      .then((data) => {
        EDITABLE_FIELDS.forEach((key) => setValue(key, data[key]));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, setValue]);

  const selectedGovernorate = governorates.find((g) => g.name === watch('recipient_governorate'));
  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updates = Object.fromEntries(EDITABLE_FIELDS.map((key) => [key, data[key]]));
      await updateDonationRequest(id, updates);
      Swal.fire('Updated', 'Donation request updated successfully!', 'success');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
        <p className="mb-4">We couldn't find a donation request with that id.</p>
        <button
          className="btn btn-neutral"
          onClick={() => navigate('/dashboard/my-donation-requests')}
        >
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
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('recipient_name', { required: true })}
          />
          {errors.recipient_name && (
            <p className="text-red-500 text-sm">Recipient name is required</p>
          )}
        </div>

        <div>
          <label className="label">Recipient Governorate</label>
          <select
            {...register('recipient_governorate', { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Governorate</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Recipient City</label>
          <select
            {...register('recipient_city', { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select City</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label">Hospital Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('hospital_name', { required: true })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Full Address</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('full_address', { required: true })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Blood Group</label>
          <select
            {...register('blood_group', { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Donation Date</label>
          <input
            type="date"
            className="input input-bordered w-full"
            {...register('donation_date', { required: true })}
          />
        </div>

        <div>
          <label className="label">Donation Time</label>
          <input
            type="time"
            className="input input-bordered w-full"
            {...register('donation_time', { required: true })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label">Request Message</label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows="4"
            {...register('request_message', { required: true })}
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-neutral w-full" disabled={saving}>
            {saving ? 'Updating...' : 'Update Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;

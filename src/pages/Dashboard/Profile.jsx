import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import Swal from 'sweetalert2';
import { AuthContext } from '../../provider/AuthProvider';

const Profile = () => {
  const { user: currentUser } = useContext(AuthContext);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      user_full_name: currentUser?.displayName || 'Amro Gad',
      user_email: currentUser?.email || 'amro@blooddono.com',
      user_blood_group: 'B+',
      user_governorate: 'Cairo',
      user_city: 'Maadi',
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState(currentUser?.photoURL);

  const selectedGovernorate = governorates.find((d) => d.name === watch('user_governorate'));
  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setProfilePic(URL.createObjectURL(image));
    }
  };

  const onSubmit = () => {
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated.',
      showConfirmButton: false,
      timer: 1500,
    });
    setEditMode(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-start mb-4">
        <div></div>
        <img src={profilePic} alt="avatar" className="w-48 h-48 mt-2 rounded-full border-2 border-zinc-400 mb-8" />
        <button onClick={() => setEditMode(!editMode)} className="btn bg-[#ff4136]">
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="label">Full Name</label>
          <input type="text" className="input input-bordered w-full" {...register('user_full_name', { required: true })} disabled={!editMode} />
        </div>

        <div>
          <label className="label">Email (not editable)</label>
          <input type="email" className="input input-bordered w-full" {...register('user_email')} disabled />
        </div>

        <div>
          <label className="label">Governorate</label>
          <select {...register('user_governorate', { required: true })} className="select select-bordered w-full" disabled={!editMode}>
            <option value="">Select Governorate</option>
            {governorates.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">City</label>
          <select {...register('user_city', { required: true })} className="select select-bordered w-full" disabled={!editMode}>
            <option value="">Select City</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label">Blood Group</label>
          <select {...register('user_blood_group', { required: true })} className="select select-bordered w-full" disabled={!editMode}>
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label"> {editMode && <>Profile Photo ( Max size 32MB )</>}</label>
          <input type="file" onChange={handleImageUpload} className={`input-bordered w-full file-input ${editMode ? "" : "hidden"}`} disabled={!editMode} />
        </div>

        {editMode && (
          <div className="col-span-2">
            <button type="submit" className="btn btn-neutral">Save Changes</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;

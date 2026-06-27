import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import { setUser } from '../../redux/authSlice';
import { updateProfile, uploadAvatar } from '../../services/profileService';

const Profile = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      display_name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      blood_group: currentUser?.bloodGroup || '',
      governorate: currentUser?.governorate || '',
      city: currentUser?.city || '',
      is_searchable: currentUser?.isSearchable || false,
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profilePic, setProfilePic] = useState(currentUser?.photoURL);

  const selectedGovernorate = governorates.find((d) => d.name === watch('governorate'));
  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (image) {
      setAvatarFile(image);
      setProfilePic(URL.createObjectURL(image));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let photoUrl = currentUser?.photoURL ?? null;
      if (avatarFile) {
        photoUrl = await uploadAvatar(currentUser.uid, avatarFile);
      }

      const updates = {
        display_name: data.display_name,
        blood_group: data.blood_group,
        governorate: data.governorate,
        city: data.city,
        is_searchable: data.is_searchable,
        photo_url: photoUrl,
      };
      await updateProfile(currentUser.uid, updates);

      dispatch(
        setUser({
          ...currentUser,
          displayName: data.display_name,
          bloodGroup: data.blood_group,
          governorate: data.governorate,
          city: data.city,
          isSearchable: data.is_searchable,
          photoURL: photoUrl,
        }),
      );

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        showConfirmButton: false,
        timer: 1500,
      });
      setAvatarFile(null);
      setEditMode(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-start mb-4">
        <div></div>
        <img
          src={profilePic || '/images/developer-avatar.jpg'}
          alt="avatar"
          className="w-48 h-48 mt-2 rounded-full border-2 border-zinc-400 mb-8 object-cover"
        />
        <button onClick={() => setEditMode(!editMode)} className="btn bg-[#ff4136]">
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register('display_name', { required: true })}
            disabled={!editMode}
          />
        </div>

        <div>
          <label className="label">Email (not editable)</label>
          <input
            type="email"
            className="input input-bordered w-full"
            {...register('email')}
            disabled
          />
        </div>

        <div>
          <label className="label">Governorate</label>
          <select
            {...register('governorate', { required: true })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select Governorate</option>
            {governorates.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">City</label>
          <select
            {...register('city', { required: true })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select City</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label">Blood Group</label>
          <select
            {...register('blood_group', { required: true })}
            className="select select-bordered w-full"
            disabled={!editMode}
          >
            <option value="">Select</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox"
              {...register('is_searchable')}
              disabled={!editMode}
            />
            <span>List me as a searchable donor (your email is never shown in search results)</span>
          </label>
        </div>

        <div className="col-span-2">
          <label className="label"> {editMode && <>Profile Photo ( Max size 32MB )</>}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={`input-bordered w-full file-input ${editMode ? '' : 'hidden'}`}
            disabled={!editMode}
          />
        </div>

        {editMode && (
          <div className="col-span-2">
            <button type="submit" className="btn btn-neutral" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;

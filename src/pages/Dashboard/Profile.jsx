import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import { setUser } from '../../redux/authSlice';
import { updateProfile, uploadAvatar } from '../../services/profileService';
import { BLOOD_GROUPS } from '../../utils/bloodCompat';
import { localizeGov, localizeCity } from '../../utils/places';

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink transition focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15 disabled:cursor-not-allowed disabled:bg-surface disabled:text-body';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

const Profile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
      if (avatarFile) photoUrl = await uploadAvatar(currentUser.uid, avatarFile);

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

      Swal.fire({ icon: 'success', title: t('profileEdit.updated'), showConfirmButton: false, timer: 1500 });
      setAvatarFile(null);
      setEditMode(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="rounded-3xl border border-line bg-card p-8">
        <div className="mb-8 flex items-center gap-4">
          <img
            src={profilePic || '/images/person-avatar.png'}
            alt=""
            className="h-20 w-20 rounded-2xl border border-line-strong object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[22px] font-semibold tracking-tight text-ink">
              {currentUser?.displayName}
            </div>
            <div className="text-[13px] text-muted">
              {currentUser?.role ? t(`auth.role.${currentUser.role}`) : ''}
              {currentUser?.bloodGroup ? ` · ${currentUser.bloodGroup}` : ''}
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="inline-flex h-10 items-center rounded-xl border border-line-strong px-4 text-sm font-semibold text-ink transition hover:border-ink/40"
          >
            {editMode ? t('common.cancel') : t('common.edit')}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              {t('register.fullName')}
            </label>
            <input
              id="profile-name"
              type="text"
              className={fieldClass}
              {...register('display_name', { required: true })}
              disabled={!editMode}
            />
          </div>

          <div>
            <label htmlFor="profile-email" className={labelClass}>
              {t('auth.email')}
            </label>
            <input
              id="profile-email"
              type="email"
              className={fieldClass}
              {...register('email')}
              disabled
            />
          </div>

          <div>
            <label htmlFor="profile-governorate" className={labelClass}>
              {t('register.governorate')}
            </label>
            <select
              id="profile-governorate"
              className={fieldClass}
              {...register('governorate', { required: true })}
              disabled={!editMode}
            >
              <option value="">{t('register.select')}</option>
              {governorates.map((d) => (
                <option key={d.id} value={d.name}>
                  {localizeGov(d.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="profile-city" className={labelClass}>
              {t('register.city')}
            </label>
            <select
              id="profile-city"
              className={fieldClass}
              {...register('city', { required: true })}
              disabled={!editMode}
            >
              <option value="">{t('register.select')}</option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {localizeCity(c.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-blood-group" className={labelClass}>
              {t('register.bloodGroup')}
            </label>
            <select
              id="profile-blood-group"
              className={fieldClass}
              {...register('blood_group', { required: true })}
              disabled={!editMode}
            >
              <option value="">{t('register.select')}</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-paper p-4">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mt-0.5"
                {...register('is_searchable')}
                disabled={!editMode}
              />
              <span className="text-[13.5px] leading-relaxed text-body">
                {t('profileEdit.searchableLabel')}
              </span>
            </label>
          </div>

          {editMode && (
            <div className="sm:col-span-2">
              <label htmlFor="profile-photo" className={labelClass}>
                {t('profileEdit.photoLabel')}
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
              />
            </div>
          )}

          {editMode && (
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
              >
                {saving ? t('profileEdit.saving') : t('profileEdit.saveChanges')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import governorates from '../../../assets/governorates.json';
import cities from '../../../assets/cities.json';
import Loading from '../../../components/Loading';
import { BLOOD_GROUPS } from '../../../utils/bloodCompat';
import { getDonationRequest, updateDonationRequest } from '../../../services/donationService';
import { localizeGov, localizeCity } from '../../../utils/places';

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

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';
const errorClass = 'mt-1 text-sm text-crimson';

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      .then((data) => EDITABLE_FIELDS.forEach((key) => setValue(key, data[key])))
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
      Swal.fire(t('editReq.updatedTitle'), t('editReq.updatedBody'), 'success');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('dash.updateFailed'), text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">{t('detail.notFound')}</h1>
        <button
          className="mt-4 text-sm font-semibold text-crimson hover:text-crimson-deep"
          onClick={() => navigate('/dashboard/my-donation-requests')}
        >
          {t('editReq.backMyRequests')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">
        {t('editReq.title')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>{t('create.patientName')}</label>
          <input className={fieldClass} {...register('recipient_name', { required: true })} />
          {errors.recipient_name && <p className={errorClass}>{t('create.errName')}</p>}
        </div>

        <div>
          <label className={labelClass}>{t('register.governorate')}</label>
          <select className={fieldClass} {...register('recipient_governorate', { required: true })}>
            <option value="">{t('register.select')}</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.name}>
                {localizeGov(g.name)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>{t('register.city')}</label>
          <select className={fieldClass} {...register('recipient_city', { required: true })}>
            <option value="">{t('register.select')}</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {localizeCity(c.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{t('create.hospital')}</label>
          <input className={fieldClass} {...register('hospital_name', { required: true })} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{t('create.fullAddress')}</label>
          <input className={fieldClass} {...register('full_address', { required: true })} />
        </div>

        <div>
          <label className={labelClass}>{t('register.bloodGroup')}</label>
          <select className={fieldClass} {...register('blood_group', { required: true })}>
            <option value="">{t('register.select')}</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>{t('editReq.date')}</label>
            <input type="date" className={fieldClass} {...register('donation_date', { required: true })} />
          </div>
          <div className="flex-1">
            <label className={labelClass}>{t('editReq.time')}</label>
            <input type="time" className={fieldClass} {...register('donation_time', { required: true })} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>{t('create.messageLabel')}</label>
          <textarea
            rows="3"
            className="w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[15px] text-ink focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15"
            {...register('request_message', { required: true })}
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
          >
            {saving ? t('editReq.updating') : t('editReq.update')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;

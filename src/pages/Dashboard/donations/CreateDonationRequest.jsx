import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { LuArrowLeft, LuArrowRight, LuCheck, LuCalendar } from 'react-icons/lu';
import governorates from '../../../assets/governorates.json';
import cities from '../../../assets/cities.json';
import { createDonationRequest } from '../../../services/donationService';
import { BLOOD_GROUPS, compatibleDonorsFor } from '../../../utils/bloodCompat';
import { getUrgency, formatNeededBy } from '../../../utils/urgency';
import { localizeGov, localizeCity } from '../../../utils/places';
import BloodRoundel from '../../../components/BloodRoundel';
import { UrgencyPill } from '../../../components/Pills';

const STEP_TITLE_KEYS = ['create.step1', 'create.step2', 'create.step3'];
const STEP_FIELDS = [
  ['recipient_name', 'blood_group'],
  [
    'hospital_name',
    'recipient_governorate',
    'recipient_city',
    'full_address',
    'donation_date',
    'donation_time',
    'request_message',
  ],
];

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

const isoOffset = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const CreateDonationRequest = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ shouldUnregister: false });
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pickDate, setPickDate] = useState(false);

  const values = watch();
  const selectedGovernorate = governorates.find((g) => g.name === values.recipient_governorate);
  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

  const next = async () => {
    if (await trigger(STEP_FIELDS[step])) setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const chooseDate = (days) => {
    setPickDate(false);
    setValue('donation_date', isoOffset(days), { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await createDonationRequest({
        requester_id: user.uid,
        requester_name: user.displayName,
        requester_email: user.email,
        recipient_name: data.recipient_name,
        recipient_governorate: data.recipient_governorate,
        recipient_city: data.recipient_city,
        hospital_name: data.hospital_name,
        full_address: data.full_address,
        blood_group: data.blood_group,
        donation_date: data.donation_date,
        donation_time: data.donation_time,
        request_message: data.request_message,
      });
      Swal.fire({
        icon: 'success',
        title: t('create.successTitle'),
        text: t('create.successBody'),
        timer: 1800,
        showConfirmButton: false,
      });
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('create.errorTitle'), text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const dateChips = [
    { labelKey: 'create.today', days: 0 },
    { labelKey: 'create.tomorrow', days: 1 },
    { labelKey: 'create.thisWeek', days: 3 },
  ];
  const activeDate = values.donation_date;
  const urgencyPreview =
    values.donation_date && values.donation_time
      ? getUrgency(values.donation_date, values.donation_time)
      : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* stepper */}
      <div className="mb-8 flex items-center gap-2">
        {STEP_TITLE_KEYS.map((titleKey, i) => (
          <div key={titleKey} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold ${
                i < step
                  ? 'bg-success text-white'
                  : i === step
                    ? 'bg-crimson text-white shadow-[0_0_0_4px_rgba(194,30,63,0.15)]'
                    : 'border-2 border-line-strong text-muted'
              }`}
            >
              {i < step ? <LuCheck className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={`hidden text-[13px] font-semibold sm:block ${
                i === step ? 'text-ink' : 'text-muted'
              }`}
            >
              {t(titleKey)}
            </span>
            {i < STEP_TITLE_KEYS.length - 1 && <div className="h-0.5 flex-1 bg-line" />}
          </div>
        ))}
      </div>

      <p className="mb-1 text-[13px] text-muted">
        {t('create.postingAs', { name: user?.displayName })}
      </p>
      <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">
        {step === 0 ? t('create.h1Step1') : step === 1 ? t('create.h1Step2') : t('create.h1Step3')}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('blood_group', { required: true })} />
        <input type="hidden" {...register('donation_date', { required: true })} />

        {/* STEP 1 */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="recipient_name" className={labelClass}>
                {t('create.patientName')}
              </label>
              <input
                id="recipient_name"
                className={fieldClass}
                placeholder={t('create.patientPlaceholder')}
                {...register('recipient_name', { required: true })}
              />
              {errors.recipient_name && (
                <p className="mt-1 text-sm text-crimson">{t('create.errName')}</p>
              )}
            </div>
            <div>
              <span className={labelClass}>{t('create.bloodTypeNeeded')}</span>
              <div className="flex flex-wrap gap-2">
                {BLOOD_GROUPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    dir="ltr"
                    onClick={() => setValue('blood_group', g, { shouldValidate: true })}
                    aria-pressed={values.blood_group === g}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-lg font-bold transition ${
                      values.blood_group === g
                        ? 'bg-crimson text-white shadow-[0_0_0_3px_rgba(194,30,63,0.18)]'
                        : 'bg-surface text-body hover:bg-line-strong'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.blood_group && (
                <p className="mt-1 text-sm text-crimson">{t('create.errBloodType')}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="hospital_name" className={labelClass}>
                {t('create.hospital')}
              </label>
              <input
                id="hospital_name"
                className={fieldClass}
                placeholder={t('create.hospitalPlaceholder')}
                {...register('hospital_name', { required: true })}
              />
              {errors.hospital_name && (
                <p className="mt-1 text-sm text-crimson">{t('create.errHospital')}</p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="recipient_governorate" className={labelClass}>
                  {t('register.governorate')}
                </label>
                <select
                  id="recipient_governorate"
                  className={fieldClass}
                  {...register('recipient_governorate', { required: true })}
                >
                  <option value="">{t('register.select')}</option>
                  {governorates.map((g) => (
                    <option key={g.id} value={g.name}>
                      {localizeGov(g.name)}
                    </option>
                  ))}
                </select>
                {errors.recipient_governorate && (
                  <p className="mt-1 text-sm text-crimson">{t('create.errGovernorate')}</p>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="recipient_city" className={labelClass}>
                  {t('register.city')}
                </label>
                <select
                  id="recipient_city"
                  className={fieldClass}
                  {...register('recipient_city', { required: true })}
                >
                  <option value="">{t('register.select')}</option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {localizeCity(c.name)}
                    </option>
                  ))}
                </select>
                {errors.recipient_city && (
                  <p className="mt-1 text-sm text-crimson">{t('create.errCity')}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="full_address" className={labelClass}>
                {t('create.fullAddress')}
              </label>
              <input
                id="full_address"
                className={fieldClass}
                placeholder={t('create.addressPlaceholder')}
                {...register('full_address', { required: true })}
              />
              {errors.full_address && (
                <p className="mt-1 text-sm text-crimson">{t('create.errAddress')}</p>
              )}
            </div>
            <div>
              <span className={labelClass}>{t('create.whenNeeded')}</span>
              <div className="flex flex-wrap gap-2">
                {dateChips.map(({ labelKey, days }) => {
                  const active = !pickDate && activeDate === isoOffset(days);
                  return (
                    <button
                      key={labelKey}
                      type="button"
                      onClick={() => chooseDate(days)}
                      className={`inline-flex h-11 items-center rounded-xl px-4 text-[13.5px] font-semibold transition ${
                        active
                          ? 'bg-ink text-on-ink'
                          : 'border border-line-strong bg-card text-ink hover:border-ink/40'
                      }`}
                    >
                      {t(labelKey)}
                      {days === 0 && (
                        <span className="ms-1.5 font-normal text-muted">{t('create.criticalTag')}</span>
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    setPickDate(true);
                    setValue('donation_date', '', { shouldValidate: false });
                  }}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[13.5px] font-semibold transition ${
                    pickDate
                      ? 'bg-ink text-on-ink'
                      : 'border border-line-strong bg-card text-ink hover:border-ink/40'
                  }`}
                >
                  <LuCalendar className="h-4 w-4" strokeWidth={2} />
                  {t('create.pickDate')}
                </button>
              </div>
              {pickDate && (
                <input
                  type="date"
                  className={`${fieldClass} mt-3`}
                  value={values.donation_date || ''}
                  onChange={(e) =>
                    setValue('donation_date', e.target.value, { shouldValidate: true })
                  }
                />
              )}
              {errors.donation_date && (
                <p className="mt-1 text-sm text-crimson">{t('create.errDate')}</p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="w-40">
                <label htmlFor="donation_time" className={labelClass}>
                  {t('create.aroundTime')}
                </label>
                <input
                  id="donation_time"
                  type="time"
                  className={fieldClass}
                  {...register('donation_time', { required: true })}
                />
                {errors.donation_time && (
                  <p className="mt-1 text-sm text-crimson">{t('create.errTime')}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="request_message" className={labelClass}>
                {t('create.messageLabel')}
              </label>
              <textarea
                id="request_message"
                rows="3"
                className="w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15"
                placeholder={t('create.messagePlaceholder')}
                {...register('request_message', { required: true })}
              />
              {errors.request_message && (
                <p className="mt-1 text-sm text-crimson">{t('create.errMessage')}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — live preview */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {t('create.previewLabel')}
            </div>
            <div className="rounded-3xl border border-line bg-card p-5 shadow-[0_28px_56px_-28px_rgba(120,20,40,0.3)]">
              <div className="flex items-center gap-3.5">
                <BloodRoundel
                  group={values.blood_group}
                  variant={urgencyPreview?.level === 'critical' ? 'solid' : 'tint'}
                  size={52}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span dir="auto" className="truncate text-[15.5px] font-semibold text-ink">
                      {values.recipient_name || t('create.patientName')}
                    </span>
                    {urgencyPreview && <UrgencyPill level={urgencyPreview.level} />}
                  </div>
                  <div dir="auto" className="mt-0.5 truncate text-[13px] text-muted">
                    {values.hospital_name} · {localizeCity(values.recipient_city)},{' '}
                    {localizeGov(values.recipient_governorate)}
                  </div>
                </div>
              </div>
              <div className="my-4 flex gap-6 rounded-2xl bg-paper px-4 py-3">
                <div>
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                    {t('card.neededBy')}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-ink">
                    {values.donation_date && values.donation_time
                      ? formatNeededBy(values.donation_date, values.donation_time)
                      : '—'}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                    {t('card.compatibleDonors')}
                  </div>
                  <div dir="ltr" className="mt-0.5 truncate text-sm font-semibold text-success">
                    {values.blood_group ? compatibleDonorsFor(values.blood_group).join('  ') : '—'}
                  </div>
                </div>
              </div>
              {values.request_message && (
                <p className="text-[13.5px] leading-relaxed text-body">{values.request_message}</p>
              )}
            </div>
            <p className="text-[13px] leading-relaxed text-muted">
              {t('create.previewNote', {
                place: localizeCity(values.recipient_city) || t('create.theHospital'),
              })}
            </p>
          </div>
        )}

        {/* nav */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          {step > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-body hover:text-ink"
            >
              <LuArrowLeft className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
              {t('create.back')}
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
            >
              {step === 0 ? t('create.continue') : t('create.reviewRequest')}
              <LuArrowRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={2} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
            >
              {saving ? t('create.posting') : t('create.post')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateDonationRequest;

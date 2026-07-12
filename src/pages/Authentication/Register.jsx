import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { signUp } from '../../services/authService';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import BrandMark from '../../components/BrandMark';
import { BLOOD_GROUPS } from '../../utils/bloodCompat';

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';
const errorClass = 'mt-1 text-sm text-crimson';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');
  const navigate = useNavigate();

  const selectedGovernorate = governorates.find((w) => w.name === watch('governorate'));
  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorate?.id);

  const onSubmit = async (data) => {
    try {
      await signUp(data);
      Swal.fire({ icon: 'success', title: 'Registered Successfully!', showConfirmButton: true }).then(
        (result) => {
          if (result.isConfirmed) navigate('/');
        },
      );
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Registration failed', text: error.message });
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-lg items-center px-4 py-12">
      <div className="w-full rounded-3xl border border-line bg-card p-8 shadow-[0_32px_64px_-32px_rgba(33,20,22,0.25)] sm:p-10">
        <div className="mb-6 flex items-center gap-2.5">
          <BrandMark size={28} />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            BloodDono
          </span>
        </div>
        <h1 className="font-display text-[26px] font-semibold tracking-tight text-ink">
          Create your donor profile
        </h1>
        <p className="mt-1 mb-7 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-crimson hover:text-crimson-deep">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reg-name" className={labelClass}>
              Full name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Full Name…"
              {...register('name', {
                required: 'Name is required!',
                minLength: { value: 5, message: 'Name should be more than 5 characters!' },
              })}
              className={fieldClass}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-email" className={labelClass}>
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="Email…"
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please provide a correct email address.',
                },
              })}
              className={fieldClass}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-blood-group" className={labelClass}>
              Blood group
            </label>
            <select
              id="reg-blood-group"
              {...register('bloodGroup', { required: 'Please select your blood group.' })}
              className={fieldClass}
            >
              <option value="">Select a blood group</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className={errorClass}>{errors.bloodGroup.message}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="reg-governorate" className={labelClass}>
                Governorate
              </label>
              <select
                id="reg-governorate"
                {...register('governorate', { required: 'Please select a governorate!' })}
                className={fieldClass}
              >
                <option value="">Select</option>
                {governorates.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.governorate && <p className={errorClass}>{errors.governorate.message}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="reg-city" className={labelClass}>
                City
              </label>
              <select
                id="reg-city"
                {...register('city', { required: 'Please select a city' })}
                className={fieldClass}
              >
                <option value="">Select</option>
                {filteredCities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.city && <p className={errorClass}>{errors.city.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className={labelClass}>
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              placeholder="Password…"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                  message: 'Must include at least one uppercase and one lowercase letter',
                },
              })}
              className={fieldClass}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password…"
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className={fieldClass}
            />
            {errors.confirm_password && <p className={errorClass}>{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-crimson text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
          >
            Create profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

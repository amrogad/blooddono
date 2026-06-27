import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { signUp } from '../../services/authService';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');

  const navigate = useNavigate();

  const selectedGovernorateName = watch('governorate');
  const selectedGovernorate = governorates.find((w) => w.name === selectedGovernorateName);
  const selectedGovernorateId = selectedGovernorate?.id;

  const filteredCities = cities.filter((c) => c.governorate_id === selectedGovernorateId);

  const onSubmit = async (data) => {
    try {
      await signUp(data);
      Swal.fire({
        icon: 'success',
        title: 'Registered Successfully!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Registration failed', text: error.message });
      return;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-20 flex justify-center items-center">
      <div className="card w-full max-w-sm shrink-0 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B0000] to-[#C41230] px-6 py-5">
          <h2 className="text-white text-2xl font-bold">Register</h2>
          <p className="text-white/70 text-sm">Create your donor account</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
            {/* name  */}
            <label className="label">Full Name</label>
            <input
              type="text"
              {...register('name', {
                required: 'Name is required!',
                minLength: {
                  value: 5,
                  message: 'Name should be more than 5 characters!',
                },
              })}
              className="input"
              placeholder="Full Name"
            />

            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

            {/* email  */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please provide a CORRECT email address!',
                },
              })}
              className="input"
              placeholder="Email"
            />

            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

            {/* blood group  */}

            <label className="block">
              Blood Group
              <select
                {...register('bloodGroup', { required: 'Please select your blood group.' })}
                className="select"
              >
                <option value=""> --- Please Select A Blood Group --- </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </label>

            {errors.bloodGroup && (
              <p className="text-red-500 text-sm mt-1">{errors.bloodGroup.message}</p>
            )}

            {/* Governorate Selector */}

            <label className="block mb-1">Governorate</label>
            <select
              {...register('governorate', { required: 'Please select a governorate!' })}
              className="select select-bordered"
            >
              <option value="">Select Governorate</option>
              {governorates.map((governorate) => (
                <option key={governorate.id} value={governorate.name}>
                  {governorate.name}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-red-500 text-sm">{errors.governorate.message}</p>
            )}

            {/* City Selector */}

            <label className="block mb-1">City</label>
            <select
              {...register('city', { required: 'Please select a city' })}
              className="select select-bordered"
            >
              <option value="">Select City</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

            {/* password  */}
            <label>Password:</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                  message: 'Must include at least one uppercase and one lowercase letter',
                },
              })}
              className="input"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            {/* Confirm Password */}
            <label>Confirm Password:</label>
            <input
              type="password"
              {...register('confirm_password', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="input"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
            )}

            <button type="submit" className="btn bg-black text-white mt-4">
              Register
            </button>
          </form>

          <p className="font-medium">
            Already have an account? Please{' '}
            <Link to="/login" className="text-[#ff4136] font-bold text-lg">
              Log in!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

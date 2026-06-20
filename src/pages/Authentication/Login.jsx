import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabaseClient';
import { DEMO_ACCOUNTS } from '../../constants/demoAccounts';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const goToRedirect = () => navigate(location.state ? location.state : '/');

    const signIn = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            Swal.fire({ icon: "error", title: "Login failed", text: error.message });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Logged In Successfully!",
            showConfirmButton: true,
        })
            .then((result) => {
                if (result.isConfirmed) {
                    goToRedirect();
                }
            });
    }

    const onSubmit = (data) => signIn(data.email, data.password);


    return (
        <div className='max-w-[1600px] mx-auto py-20 flex justify-center items-center'>
            <div className="card w-full max-w-sm shrink-0 shadow-2xl overflow-hidden">
                <div className='bg-gradient-to-r from-[#8B0000] to-[#C41230] px-6 py-5'>
                    <h2 className='text-white text-2xl font-bold'>Login</h2>
                    <p className='text-white/70 text-sm'>Welcome back</p>
                </div>
                <div className="card-body">

                    <form onSubmit={handleSubmit(onSubmit)} className="fieldset">

                        {/* email  */}
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required!', pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Please provide a CORRECT email address!',
                                },
                            })}
                            className="input" placeholder="Email" />

                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

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
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message}</p>
                        )}

                        <button type='submit' className="btn bg-black text-white mt-4">Login</button>
                    </form>

                    <div className="divider">Demo logins</div>
                    <div className="flex flex-col gap-2">
                        {DEMO_ACCOUNTS.map((acc) => (
                            <button
                                key={acc.role}
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => signIn(acc.email, acc.password)}
                            >
                                {acc.label}
                            </button>
                        ))}
                    </div>

                    <p className='font-medium'>Don't have an account? Please {" "}
                        <Link to='/register' className='text-[#ff4136] font-bold text-lg'>
                            Register!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

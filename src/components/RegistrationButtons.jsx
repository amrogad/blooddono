import { Link } from 'react-router';

const RegistrationButtons = () => {
  return (
    <div className="hidden lg:flex justify-center items-center gap-4">
      <Link to="/register">
        <button className="border-2 border-[#ff4136] hover:bg-[#d63027] hover:border-[#d63027] hover:cursor-pointer font-bold text-xl px-6 py-3 rounded-md bg-[#ff4136] text-white transition-colors duration-200">
          Register
        </button>
      </Link>

      <Link to="/login">
        <button className="text-white hover:cursor-pointer bg-black font-bold text-xl px-6 py-3 rounded-md border-2 border-black hover:bg-gray-800 hover:border-gray-800 transition-colors duration-200">
          Login
        </button>
      </Link>
    </div>
  );
};

export default RegistrationButtons;

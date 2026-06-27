import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="relative flex flex-col-reverse lg:flex-row items-stretch overflow-hidden mb-8">
      {/* Dark red text column */}
      <div className="relative w-full lg:w-3/5 bg-[#8B0000] px-8 py-14 lg:px-16 lg:py-24 flex items-center">
        <div className="max-w-2xl">
          <h1 className="playwrite-au-sa-font text-4xl lg:text-5xl font-bold leading-tight text-white">
            Where Every Connection is a Lifesaver!
          </h1>
          <p className="text-lg lg:text-xl my-8 text-white/80">
            Join our mission to save lives — one donor, one drop, one heartbeat at a time. Make a
            difference. Be someone's reason to smile again.
          </p>
          <div className="flex flex-wrap gap-4">
            {!user && (
              <Link to="/register">
                <button className="bg-black hover:bg-gray-800 text-white font-bold text-xl px-8 py-3 rounded-md transition-colors duration-200">
                  Join as a donor
                </button>
              </Link>
            )}
            <Link to="/search">
              <button className="bg-white hover:bg-gray-100 text-[#8B0000] font-bold text-xl px-8 py-3 rounded-md transition-colors duration-200">
                Search Donors
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Organic curve separator — desktop only */}
      <svg
        className="hidden lg:block absolute top-0 z-10 pointer-events-none"
        style={{ left: 'calc(60% - 40px)', height: '100%', width: '80px' }}
        viewBox="0 0 80 500"
        preserveAspectRatio="none"
      >
        <path d="M 0 0 Q 80 250 0 500 L 80 500 L 80 0 Z" fill="white" />
      </svg>

      {/* Image column */}
      <div className="w-full lg:w-2/5 flex justify-center items-center p-8 lg:p-12 bg-white">
        <img src="/images/blood-hero.png" alt="" className="max-w-xs lg:max-w-sm w-full" />
      </div>
    </div>
  );
};

export default Hero;

import { Link } from 'react-router';
import { useSelector } from 'react-redux';

const Hero = () => {
    const { user } = useSelector((state) => state.auth);
    return (
        <div className='flex flex-col-reverse lg:flex-row justify-between items-center p-4 mb-12'>
            <div className='w-full lg:w-2/3'>
                <h1 className='playwrite-au-sa-font text-5xl font-bold leading-16 text-[#ff4136]'>
                    Where Every Connection is a Lifesaver!
                </h1>
                <div className='text-2xl my-8 text-[#333333]'>
                    <p> Join our mission to save lives — one donor, one drop, one heartbeat at a time. <br /> Make a difference. Be someone's reason to smile again.</p>
                </div>
                <div className='flex justify-start items-center gap-4'>
                    {
                        !user && <>
                            <Link to="/register">
                                <button className='border-2 border-[#ff4136] hover:bg-[#d63027] hover:border-[#d63027] hover:cursor-pointer font-bold text-xl px-6 py-3 rounded-md bg-[#ff4136] text-white transition-colors duration-200'>Join as a donor</button>
                            </Link>
                        </>
                    }

                    <Link to="/search">
                        <button className='border-2 border-[#ff4136] hover:bg-[#d63027] hover:border-[#d63027] hover:cursor-pointer font-bold text-xl px-6 py-3 rounded-md bg-[#ff4136] text-white transition-colors duration-200'>Search Donors</button>
                    </Link>
                </div>
            </div>

            <div className='w-full lg:w-1/3'>
                <img src="/images/blood-hero.png" alt="" />
            </div>
        </div>
    );
};

export default Hero;
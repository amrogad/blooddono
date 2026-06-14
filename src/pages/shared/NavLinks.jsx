import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';

const NavLinks = () => {
    const {user} = useSelector((state) => state.auth);
    return (
        <div className='flex flex-col lg:flex-row justify-center items-center'>
            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/">Home</NavLink>
            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/search">Search</NavLink>
            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/blood-donation-request">Donation Request</NavLink>
            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/blogs">Blogs</NavLink>
            {
                user && <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/funds">Funds</NavLink>
            }
            <NavLink className={`mr-8 text-2xl hover:underline decoration-2`} to="/about-us">About Us</NavLink>
        </div>
    );
};

export default NavLinks;
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-crimson' : 'text-body hover:text-ink'}`;

const NavLinks = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center gap-7">
      <NavLink className={linkClass} to="/blood-donation-request">
        Requests
      </NavLink>
      <NavLink className={linkClass} to="/search">
        Find donors
      </NavLink>
      <NavLink className={linkClass} to="/blogs">
        Blogs
      </NavLink>
      {user && (
        <NavLink className={linkClass} to="/funds">
          Funds
        </NavLink>
      )}
      <NavLink className={linkClass} to="/about-us">
        About
      </NavLink>
    </div>
  );
};

export default NavLinks;

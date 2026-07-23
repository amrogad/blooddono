import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-crimson' : 'text-body hover:text-ink'}`;

const NavLinks = () => {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-7">
      <NavLink className={linkClass} to="/blood-donation-request">
        {t('nav.requests')}
      </NavLink>
      <NavLink className={linkClass} to="/search">
        {t('nav.findDonors')}
      </NavLink>
      <NavLink className={linkClass} to="/blogs">
        {t('nav.blogs')}
      </NavLink>
      {user && (
        <NavLink className={linkClass} to="/funds">
          {t('nav.funds')}
        </NavLink>
      )}
      <NavLink className={linkClass} to="/about-us">
        {t('nav.about')}
      </NavLink>
    </div>
  );
};

export default NavLinks;

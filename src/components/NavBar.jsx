import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HiMenu } from 'react-icons/hi';
import { RiCloseLargeFill } from 'react-icons/ri';
import NavLinks from './NavLinks';
import RegistrationButtons from './RegistrationButtons';
import ProfilePicture from './ProfilePicture';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import BrandMark from './BrandMark';

const mobileLinkClass = 'py-2 text-lg font-medium text-body hover:text-ink';

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-3">
      <div className="flex flex-row items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2">
          <BrandMark size={28} />
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            BloodDono
          </span>
        </Link>

        <div className="hidden lg:flex">
          <NavLinks />
        </div>

        <div className="flex items-center justify-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {user ? <ProfilePicture /> : <RegistrationButtons />}

          <div className="flex flex-col lg:hidden">
            <button
              type="button"
              onClick={() => setOpenMenu(!openMenu)}
              aria-expanded={openMenu}
              aria-label={t('nav.toggleMenu')}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink"
            >
              {openMenu ? (
                <RiCloseLargeFill aria-hidden="true" className="text-2xl" />
              ) : (
                <HiMenu aria-hidden="true" className="text-2xl" />
              )}
            </button>

            <div
              className={`absolute end-4 z-100 flex flex-col gap-1 rounded-2xl border border-line bg-card p-4 shadow-[0_24px_56px_-16px_rgba(33,20,22,0.3)] duration-500 ${
                openMenu ? 'top-20' : '-top-[130vh]'
              }`}
            >
              <NavLink className={mobileLinkClass} to="/blood-donation-request">
                {t('nav.requests')}
              </NavLink>
              <NavLink className={mobileLinkClass} to="/search">
                {t('nav.findDonors')}
              </NavLink>
              <NavLink className={mobileLinkClass} to="/blogs">
                {t('nav.blogs')}
              </NavLink>
              {user && (
                <NavLink className={mobileLinkClass} to="/assistant">
                  {t('nav.assistant')}
                </NavLink>
              )}
              {user && (
                <NavLink className={mobileLinkClass} to="/funds">
                  {t('nav.funds')}
                </NavLink>
              )}
              <NavLink className={mobileLinkClass} to="/about-us">
                {t('nav.about')}
              </NavLink>

              {!user && (
                <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
                  <Link
                    to="/register"
                    className="w-full rounded-xl bg-crimson px-6 py-2.5 text-center text-base font-semibold text-white"
                  >
                    {t('nav.becomeDonor')}
                  </Link>
                  <Link
                    to="/login"
                    className="w-full rounded-xl border border-line-strong px-6 py-2.5 text-center text-base font-semibold text-ink"
                  >
                    {t('nav.signIn')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

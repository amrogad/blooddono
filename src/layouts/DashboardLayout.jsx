import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { HiMenu } from 'react-icons/hi';
import {
  LuLayoutGrid,
  LuDroplet,
  LuPlus,
  LuSearch,
  LuUser,
  LuUsers,
  LuFileText,
  LuHeart,
} from 'react-icons/lu';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading';
import ProfilePicture from '../components/ProfilePicture';
import BrandMark from '../components/BrandMark';
import ThemeToggle from '../components/ThemeToggle';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 h-10 px-3 rounded-xl text-[13.5px] transition ${
    isActive ? 'bg-crimson-tint font-semibold text-crimson' : 'font-medium text-body hover:bg-surface'
  }`;

const DashboardLayout = () => {
  const { role, loading } = useUserRole();

  if (loading) return <Loading />;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex min-h-screen flex-col bg-paper">
        <div className="flex h-16 items-center justify-between border-b border-line bg-card px-5">
          <div className="flex items-center gap-2">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-ink lg:hidden"
            >
              <HiMenu className="text-2xl" />
            </label>
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ProfilePicture />
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full w-72 flex-col border-r border-line bg-card p-4">
          <Link to="/" className="mb-6 flex items-center gap-2 px-2 pt-1">
            <BrandMark size={26} />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              BloodDono
            </span>
            {role && (
              <span className="ml-auto rounded-full bg-ink px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-on-ink">
                {role}
              </span>
            )}
          </Link>

          <nav className="flex flex-col gap-1">
            <NavLink to="/dashboard" end className={linkClass}>
              <LuLayoutGrid className="h-4 w-4" strokeWidth={2} />
              Overview
            </NavLink>

            {role === 'donor' && (
              <>
                <NavLink to="/dashboard/my-donation-requests" className={linkClass}>
                  <LuDroplet className="h-4 w-4" strokeWidth={2} />
                  My requests
                </NavLink>
                <NavLink to="/dashboard/create-donation-request" className={linkClass}>
                  <LuPlus className="h-4 w-4" strokeWidth={2} />
                  New request
                </NavLink>
              </>
            )}

            {(role === 'admin' || role === 'volunteer') && (
              <>
                <NavLink to="/dashboard/all-blood-donation-request" className={linkClass}>
                  <LuDroplet className="h-4 w-4" strokeWidth={2} />
                  Requests
                </NavLink>
                <NavLink to="/dashboard/content-management-page" className={linkClass}>
                  <LuFileText className="h-4 w-4" strokeWidth={2} />
                  Blogs
                </NavLink>
              </>
            )}

            {role === 'admin' && (
              <NavLink to="/dashboard/all-users" className={linkClass}>
                <LuUsers className="h-4 w-4" strokeWidth={2} />
                Users
              </NavLink>
            )}

            <NavLink to="/search" className={linkClass}>
              <LuSearch className="h-4 w-4" strokeWidth={2} />
              Find donors
            </NavLink>
            <NavLink to="/funds" className={linkClass}>
              <LuHeart className="h-4 w-4" strokeWidth={2} />
              Funding
            </NavLink>
            <NavLink to="/dashboard/profile" className={linkClass}>
              <LuUser className="h-4 w-4" strokeWidth={2} />
              Profile
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

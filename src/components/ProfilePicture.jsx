import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logOut } from '../services/authService';
import { setRole } from '../redux/authSlice';
import Swal from 'sweetalert2';

const ProfilePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: t('nav.signOutFailed'), text: error.message });
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="flex items-center">
        <div className="tooltip tooltip-bottom" data-tip={user.displayName}>
          <img
            className="h-10 w-10 rounded-full border border-line-strong object-cover"
            src={user.photoURL ? user.photoURL : '/images/person-avatar.png'}
            alt=""
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-1 mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-[0_24px_56px_-16px_rgba(33,20,22,0.3)]"
      >
        <li>
          <Link
            to="/dashboard"
            className="rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            {t('nav.dashboard')}
          </Link>
        </li>

        <li className="menu-title px-3 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted">
          {t('nav.demoRole')}
        </li>
        {['admin', 'donor', 'volunteer'].map((r) => (
          <li key={r}>
            <button
              onClick={() => dispatch(setRole(r))}
              className={`rounded-xl px-3 py-2 text-sm hover:bg-surface ${
                user.role === r ? 'font-semibold text-crimson' : 'text-body'
              }`}
            >
              {t(`auth.role.${r}`)}
            </button>
          </li>
        ))}

        <li className="mt-1 border-t border-line pt-1">
          <button
            onClick={handleLogOut}
            className="rounded-xl px-3 py-2 text-sm font-medium text-crimson hover:bg-crimson-tint"
          >
            {t('nav.logout')}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfilePicture;

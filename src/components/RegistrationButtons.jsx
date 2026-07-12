import { Link } from 'react-router';

const RegistrationButtons = () => {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <Link
        to="/login"
        className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold text-ink transition hover:bg-surface"
      >
        Sign in
      </Link>
      <Link
        to="/register"
        className="inline-flex h-10 items-center rounded-xl bg-crimson px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
      >
        Become a donor
      </Link>
    </div>
  );
};

export default RegistrationButtons;

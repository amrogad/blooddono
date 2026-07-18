import { LuLock } from 'react-icons/lu';
import { Link } from 'react-router';

const Forbidden = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-crimson-tint">
        <LuLock className="h-6 w-6 text-crimson" strokeWidth={2} />
      </div>
      <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">
        Access denied
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body">
        You do not have permission to view this page. If you think this is a mistake, reach out to
        an administrator.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-crimson px-5 text-sm font-semibold text-white transition hover:bg-crimson-deep"
      >
        Back to home
      </Link>
    </div>
  );
};

export default Forbidden;

import { Link } from 'react-router';

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="font-display text-[88px] font-semibold leading-none text-crimson">404</div>
      <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-body">
        This page is not available anymore, or something went wrong along the way.
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

export default ErrorPage;

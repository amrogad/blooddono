import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { LuArrowRight } from 'react-icons/lu';

const JoinBand = () => {
  const { user } = useSelector((state) => state.auth);
  if (user) return null;

  return (
    <section className="bg-crimson-deep">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-[30px] font-semibold leading-tight tracking-tight text-white">
            Be someone&apos;s reason to get better.
          </h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/75">
            Create a donor profile in 90 seconds. When a compatible patient near you needs blood,
            you&apos;ll be the one who can help.
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex h-[52px] shrink-0 items-center gap-2.5 rounded-2xl bg-white px-6 text-[15.5px] font-semibold text-crimson-deep shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] transition hover:bg-crimson-tint"
        >
          Become a donor
          <LuArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
};

export default JoinBand;

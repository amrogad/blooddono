import { Link } from 'react-router';
import { LuCheck, LuArrowRight } from 'react-icons/lu';

const REASONS = [
  'Search donors by blood type, governorate, and city',
  'Matching that understands compatibility, not just exact type',
  'Donor profiles you can see before you reach out',
  'Requests that reach the widest safe pool of donors nearby',
  'Role-based access for donors, volunteers, and admins',
  'A clean interface that works on any phone',
];

const AboutUs = () => {
  return (
    <div className="bg-paper">
      {/* header */}
      <section className="border-b border-line bg-gradient-to-b from-card to-paper">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-crimson/20 bg-crimson-tint px-3.5 py-1.5 text-[12.5px] font-semibold text-crimson">
            About BloodDono
          </span>
          <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.08] tracking-tight text-ink">
            A faster way to find blood.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-body">
            BloodDono connects patients who need blood with donors who can give it, matched by blood
            type and city, in hours instead of days.
          </p>
        </div>
      </section>

      {/* what we do */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
          Why we built it
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-body">
          <p>
            When someone needs blood, every hour counts. Too often families end up posting in group
            chats and hoping the right person happens to see it in time.
          </p>
          <p>
            BloodDono turns that scramble into one place. Post a request with the patient&apos;s
            blood type, hospital, and when it&apos;s needed, and compatible donors nearby see it
            right away. Donors can search the other way too, and step in the moment they&apos;re a
            match.
          </p>
        </div>
      </section>

      {/* why choose */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
            What you can do here
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <div key={reason} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson-tint">
                  <LuCheck className="h-3.5 w-3.5 text-crimson" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-body">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it's built */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-[27px] font-semibold tracking-tight text-ink">
          How it works under the hood
        </h2>
        <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-body">
          <p>
            BloodDono is built with React and Tailwind, with Supabase handling accounts and data.
            Matching is blood-type aware, so an O&minus; donor is offered to every patient they can
            safely help, not just an exact match.
          </p>
          <p>
            Every account is real. Create your own, or sign in with a demo account to explore the
            donor, volunteer, and admin views.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-crimson px-6 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
          >
            Become a donor
            <LuArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <Link
            to="/blood-donation-request"
            className="inline-flex h-12 items-center rounded-xl border border-line-strong bg-card px-6 text-[15px] font-semibold text-ink transition hover:border-ink/40"
          >
            See open requests
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

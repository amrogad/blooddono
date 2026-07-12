import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { LuDroplet, LuFileText, LuArrowRight } from 'react-icons/lu';

const cards = [
  {
    to: '/dashboard/all-blood-donation-request',
    icon: LuDroplet,
    title: 'Blood donation requests',
    body: 'Review and track every request across the network.',
  },
  {
    to: '/dashboard/content-management-page',
    icon: LuFileText,
    title: 'Stories',
    body: 'Write and publish stories for the community.',
  },
];

const VolunteerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="text-[13.5px] text-muted">Welcome back</div>
      <h1 className="mt-0.5 mb-1 font-display text-[28px] font-semibold tracking-tight text-ink">
        {user?.displayName}
      </h1>
      <p className="mb-6 text-sm text-muted">
        As a volunteer you can review requests and manage published stories.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ to, icon: Icon, title, body }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(33,20,22,0.2)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-tint">
              <Icon className="h-5 w-5 text-crimson" strokeWidth={2} />
            </div>
            <h2 className="mt-4 flex items-center gap-1.5 text-[16.5px] font-semibold text-ink">
              {title}
              <LuArrowRight
                className="h-4 w-4 text-crimson transition group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-body">{body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VolunteerDashboard;

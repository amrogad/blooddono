import { LuPlus, LuSearch, LuDroplet } from 'react-icons/lu';

const STEPS = [
  {
    icon: LuPlus,
    n: '01',
    title: 'A request is posted',
    body: "Family or hospital staff post the patient's blood type, city and needed-by time. Takes under two minutes.",
  },
  {
    icon: LuSearch,
    n: '02',
    title: 'Compatible donors are matched',
    body: 'We match by blood-type compatibility and location — not exact type — so every request reaches the widest safe pool.',
  },
  {
    icon: LuDroplet,
    n: '03',
    title: 'You donate at the hospital',
    body: 'Accept the request, head to the hospital and give. One donation can help up to three patients.',
  },
];

const HowItWorks = () => (
  <section className="bg-paper">
    <div className="mx-auto max-w-[1180px] px-6 py-16">
      <h2 className="mb-8 font-display text-[27px] font-semibold tracking-tight text-ink">
        From request to donation in three steps
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, n, title, body }) => (
          <div
            key={n}
            className="rounded-3xl border border-line bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(33,20,22,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-tint">
                <Icon className="h-5 w-5 text-crimson" strokeWidth={2} />
              </div>
              <span className="font-display text-sm font-semibold text-line-strong">{n}</span>
            </div>
            <h3 className="mt-4 text-[16.5px] font-semibold text-ink">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-body">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

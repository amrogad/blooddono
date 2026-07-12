import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { LuDroplet, LuArrowRight } from 'react-icons/lu';
import BloodRoundel from '../../components/BloodRoundel';
import { UrgencyPill } from '../../components/Pills';
import { getPendingRequests } from '../../services/donationService';
import { getUrgency, formatNeededBy, requestDateTime } from '../../utils/urgency';
import { compatibleDonorsFor } from '../../utils/bloodCompat';

// The most urgent live request is the hero image — real activity proves the
// network works better than any illustration or invented stat.
const HeroLiveCard = ({ req, onDonate, onDetails }) => {
  const { level } = getUrgency(req.donation_date, req.donation_time);
  const compatible = compatibleDonorsFor(req.blood_group);
  return (
    <div className="relative">
      <div className="absolute -right-3 top-10 bottom-2 left-8 rotate-2 rounded-3xl border border-line bg-card/70" />
      <div className="absolute right-1 top-7 bottom-4 left-4 -rotate-1 rounded-3xl border border-line bg-card/80" />
      <div className="relative rounded-3xl border border-line bg-card p-5 shadow-[0_32px_64px_-28px_rgba(120,20,40,0.35)]">
        <div className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-crimson">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-crimson" />
          Live request
        </div>
        <div className="flex items-center gap-3.5">
          <BloodRoundel group={req.blood_group} variant={level === 'critical' ? 'solid' : 'tint'} size={54} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[16.5px] font-semibold text-ink">
                {req.recipient_name}
              </span>
              <UrgencyPill level={level} />
            </div>
            <div className="mt-0.5 truncate text-[13.5px] text-muted">
              {[req.recipient_city, req.recipient_governorate].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
        <div className="my-4 flex gap-6 rounded-2xl bg-paper px-4 py-3">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
              Needed by
            </div>
            <div className="mt-0.5 text-sm font-semibold text-ink">
              {formatNeededBy(req.donation_date, req.donation_time)}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted">
              Compatible donors
            </div>
            <div className="mt-0.5 truncate text-sm font-semibold text-success">
              {compatible.join('  ')}
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onDonate}
            className="inline-flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl bg-crimson text-[14.5px] font-semibold text-white transition hover:bg-crimson-deep"
          >
            <LuDroplet className="h-4 w-4" strokeWidth={2.2} />I can donate
          </button>
          <button
            onClick={onDetails}
            className="inline-flex h-[46px] items-center justify-center rounded-xl border border-line px-[18px] text-[14.5px] font-semibold text-ink transition hover:border-line-strong"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getPendingRequests()
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  const featured = useMemo(() => {
    const isPast = (r) => getUrgency(r.donation_date, r.donation_time).level === 'pastdue';
    return [...requests].sort((a, b) => {
      const pa = isPast(a) ? 1 : 0;
      const pb = isPast(b) ? 1 : 0;
      if (pa !== pb) return pa - pb;
      return (
        requestDateTime(a.donation_date, a.donation_time) -
        requestDateTime(b.donation_date, b.donation_time)
      );
    })[0];
  }, [requests]);

  const openCount = requests.length;
  const goDetails = (id) => navigate(`/home-donation-request-details/${id}`);
  const handleDonate = (id) => (user ? goDetails(id) : navigate('/login'));

  return (
    <section className="bg-gradient-to-b from-card to-paper">
      <div className="mx-auto grid max-w-[1180px] items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-crimson/20 bg-crimson-tint px-3.5 py-1.5 text-[12.5px] font-semibold text-crimson">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-crimson" />
            {openCount > 0
              ? `${openCount} open ${openCount === 1 ? 'request' : 'requests'} across Egypt right now`
              : 'Matching donors with patients across Egypt'}
          </span>
          <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.05] tracking-tight text-ink lg:text-[56px]">
            Someone near you
            <br />
            needs blood today.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
            BloodDono matches donors with patients in the same city — by blood type, in hours not
            days. Free and human.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={user ? '/blood-donation-request' : '/register'}
              className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl bg-crimson px-6 text-[15.5px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep"
            >
              <LuDroplet className="h-[18px] w-[18px]" strokeWidth={2.2} />I can give blood
            </Link>
            <Link
              to="/blood-donation-request"
              className="inline-flex h-[52px] items-center gap-2.5 rounded-2xl border border-line-strong bg-card px-6 text-[15.5px] font-semibold text-ink transition hover:border-ink/40"
            >
              I need blood
              <LuArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="lg:pl-6">
          {featured && (
            <HeroLiveCard
              req={featured}
              onDonate={() => handleDonate(featured.id)}
              onDetails={() => goDetails(featured.id)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

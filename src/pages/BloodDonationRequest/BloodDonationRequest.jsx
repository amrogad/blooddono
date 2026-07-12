import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { LuPlus } from 'react-icons/lu';
import Loading from '../../components/Loading';
import RequestCard from '../../components/RequestCard';
import { getPendingRequests } from '../../services/donationService';
import { getUrgency, requestDateTime } from '../../utils/urgency';
import { canDonate, BLOOD_GROUPS } from '../../utils/bloodCompat';
import governorates from '../../assets/governorates.json';

const SECTION_ORDER = ['today', 'week', 'later'];
const SECTION_LABELS = { today: 'Today', week: 'This week', later: 'Later' };

const selectClass =
  'h-10 rounded-xl border border-line bg-card px-3 text-[13.5px] font-medium text-ink';

const BloodDonationRequest = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const canCreate = user?.role === 'donor' || user?.role === 'admin';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodType, setBloodType] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [sort, setSort] = useState('soonest');
  const [compatOnly, setCompatOnly] = useState(false);

  useEffect(() => {
    getPendingRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = requests;
    if (bloodType) list = list.filter((r) => r.blood_group === bloodType);
    if (governorate) list = list.filter((r) => r.recipient_governorate === governorate);
    if (compatOnly && user?.bloodGroup) {
      list = list.filter((r) => canDonate(user.bloodGroup, r.blood_group));
    }
    return list;
  }, [requests, bloodType, governorate, compatOnly, user?.bloodGroup]);

  const sections = useMemo(() => {
    const groups = { today: [], week: [], later: [] };
    for (const r of filtered) {
      groups[getUrgency(r.donation_date, r.donation_time).sectionKey].push(r);
    }
    const dir = sort === 'latest' ? -1 : 1;
    const isPast = (r) => getUrgency(r.donation_date, r.donation_time).level === 'pastdue';
    for (const key of SECTION_ORDER) {
      groups[key].sort((a, b) => {
        const pa = isPast(a) ? 1 : 0;
        const pb = isPast(b) ? 1 : 0;
        if (pa !== pb) return pa - pb;
        return (
          dir *
          (requestDateTime(a.donation_date, a.donation_time) -
            requestDateTime(b.donation_date, b.donation_time))
        );
      });
    }
    return groups;
  }, [filtered, sort]);

  const criticalToday = sections.today.filter(
    (r) => getUrgency(r.donation_date, r.donation_time).level === 'critical',
  ).length;

  const goDetails = (id) => navigate(`/home-donation-request-details/${id}`);
  const handleDonate = (id) => (user ? goDetails(id) : navigate('/login'));

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Open requests
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? 'person is' : 'people are'} waiting
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => navigate('/dashboard/create-donation-request')}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
          >
            <LuPlus className="h-4 w-4" strokeWidth={2.4} />
            New request
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <select
          aria-label="Filter by blood type"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className={selectClass}
        >
          <option value="">All blood types</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by governorate"
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className={selectClass}
        >
          <option value="">All governorates</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort order"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
        >
          <option value="soonest">Needed soonest</option>
          <option value="latest">Latest first</option>
        </select>

        {user?.bloodGroup && (
          <button
            type="button"
            onClick={() => setCompatOnly((v) => !v)}
            aria-pressed={compatOnly}
            className={`ml-auto inline-flex h-10 items-center gap-2.5 rounded-full pl-3.5 pr-1.5 text-[13px] font-semibold transition ${
              compatOnly ? 'bg-ink text-on-ink' : 'border border-line bg-card text-body'
            }`}
          >
            Compatible with my {user.bloodGroup}
            <span
              className={`relative h-6 w-10 rounded-full transition ${
                compatOnly ? 'bg-crimson' : 'bg-line-strong'
              }`}
            >
              <span
                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${
                  compatOnly ? 'right-[3px]' : 'left-[3px]'
                }`}
              />
            </span>
          </button>
        )}
      </div>

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">No open requests right now</p>
          <p className="mt-1 text-sm text-muted">
            {requests.length > 0
              ? 'Try clearing your filters.'
              : 'Check back soon — new requests appear here as they are posted.'}
          </p>
        </div>
      ) : (
        SECTION_ORDER.map(
          (key) =>
            sections[key].length > 0 && (
              <section key={key} className="mb-7">
                <div
                  className={`mb-2.5 flex items-center gap-2 px-0.5 text-[11.5px] font-bold uppercase tracking-wider ${
                    key === 'today' ? 'text-crimson' : 'text-muted'
                  }`}
                >
                  {key === 'today' && (
                    <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-crimson" />
                  )}
                  {SECTION_LABELS[key]}
                  {key === 'today' && criticalToday > 0 && (
                    <span className="font-semibold normal-case tracking-normal text-muted">
                      — {criticalToday} critical
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2.5">
                  {sections[key].map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      onDetails={() => goDetails(req.id)}
                      onDonate={() => handleDonate(req.id)}
                    />
                  ))}
                </div>
              </section>
            ),
        )
      )}
    </div>
  );
};

export default BloodDonationRequest;

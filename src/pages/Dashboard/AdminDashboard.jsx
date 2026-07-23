import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LuUsers, LuDroplet, LuHeart, LuArrowRight } from 'react-icons/lu';
import { getAllProfiles } from '../../services/profileService';
import { getDonationRequests } from '../../services/donationService';
import { getFundsTotal } from '../../services/fundService';
import BloodRoundel from '../../components/BloodRoundel';
import { StatusPill } from '../../components/Pills';
import { formatNeededBy } from '../../utils/urgency';
import { localizeCity } from '../../utils/places';

const StatCard = ({ to, label, value, sub, icon: Icon }) => (
  <Link
    to={to}
    className="rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(33,20,22,0.2)]"
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      <Icon className="h-4 w-4 text-crimson" strokeWidth={2} />
    </div>
    <div className="mt-2 font-display text-3xl font-semibold text-ink">{value}</div>
    {sub && <div className="mt-1 text-[12.5px] text-muted">{sub}</div>}
  </Link>
);

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [funds, setFunds] = useState(0);

  useEffect(() => {
    Promise.all([getAllProfiles(), getDonationRequests(), getFundsTotal()])
      .then(([u, r, f]) => {
        setUsers(u);
        setRequests(r);
        setFunds(f);
      })
      .catch(() => {});
  }, []);

  const openCount = requests.filter((r) => r.donation_status === 'pending').length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">
        {t('dash.networkOverview')}
      </h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          to="/dashboard/all-blood-donation-request"
          label={t('dash.openRequests')}
          value={openCount}
          sub={t('dash.totalCount', { count: requests.length })}
          icon={LuDroplet}
        />
        <StatCard
          to="/dashboard/all-users"
          label={t('dash.registeredUsers')}
          value={users.length}
          sub={t('dash.usersSub')}
          icon={LuUsers}
        />
        <StatCard
          to="/funds"
          label={t('funds.title')}
          value={t('funds.egpAmount', { amount: funds.toLocaleString() })}
          sub={t('dash.totalRaised')}
          icon={LuHeart}
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">{t('dash.recentRequests')}</h2>
          <Link
            to="/dashboard/all-blood-donation-request"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-crimson hover:text-crimson-deep"
          >
            {t('dash.allRequests')}
            <LuArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={2} />
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-card px-4">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{t('dash.noRequests')}</p>
          ) : (
            requests.slice(0, 6).map((r) => (
              <Link
                key={r.id}
                to={`/dashboard/donation-details/${r.id}`}
                className="flex items-center gap-3 border-b border-line py-3 last:border-0"
              >
                <BloodRoundel group={r.blood_group} variant="tint" size={38} />
                <div className="min-w-0 flex-1">
                  <div dir="auto" className="truncate text-[14px] font-semibold text-ink">
                    {r.recipient_name}
                  </div>
                  <div dir="auto" className="truncate text-[12px] text-muted">
                    {[r.hospital_name, localizeCity(r.recipient_city)].filter(Boolean).join(' · ')} ·{' '}
                    {formatNeededBy(r.donation_date, r.donation_time)}
                  </div>
                </div>
                <StatusPill status={r.donation_status} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

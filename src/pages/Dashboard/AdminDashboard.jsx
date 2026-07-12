import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { LuUsers, LuDroplet, LuHeart } from 'react-icons/lu';
import { getAllProfiles } from '../../services/profileService';
import { getDonationRequests } from '../../services/donationService';
import { getFundsTotal } from '../../services/fundService';
import BloodRoundel from '../../components/BloodRoundel';
import { StatusPill } from '../../components/Pills';
import { formatNeededBy } from '../../utils/urgency';

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
        Network overview
      </h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          to="/dashboard/all-blood-donation-request"
          label="Open requests"
          value={openCount}
          sub={`${requests.length} total`}
          icon={LuDroplet}
        />
        <StatCard
          to="/dashboard/all-users"
          label="Registered users"
          value={users.length}
          sub="donors, volunteers, admins"
          icon={LuUsers}
        />
        <StatCard
          to="/funds"
          label="Community fund"
          value={`EGP ${funds.toLocaleString()}`}
          sub="total raised"
          icon={LuHeart}
        />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Recent requests</h2>
          <Link
            to="/dashboard/all-blood-donation-request"
            className="text-[13px] font-semibold text-crimson hover:text-crimson-deep"
          >
            All requests →
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-card px-4">
          {requests.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No requests yet.</p>
          ) : (
            requests.slice(0, 6).map((r) => (
              <Link
                key={r.id}
                to={`/dashboard/donation-details/${r.id}`}
                className="flex items-center gap-3 border-b border-line py-3 last:border-0"
              >
                <BloodRoundel group={r.blood_group} variant="tint" size={38} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-ink">
                    {r.recipient_name}
                  </div>
                  <div className="truncate text-[12px] text-muted">
                    {[r.hospital_name, r.recipient_city].filter(Boolean).join(' · ')} ·{' '}
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

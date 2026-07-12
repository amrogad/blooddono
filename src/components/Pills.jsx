// Urgency (of a need) and status (of a request) as pills. Labels are plain
// English for now; the Arabic pass swaps them to i18n keys.

const URGENCY = {
  critical: { label: 'CRITICAL', cls: 'bg-crimson text-white', dot: true },
  urgent: { label: 'URGENT', cls: 'bg-warning-tint text-warning' },
  planned: { label: 'PLANNED', cls: 'bg-surface text-body' },
  pastdue: { label: 'PAST DUE', cls: 'bg-surface text-muted' },
};

export function UrgencyPill({ level = 'planned' }) {
  const u = URGENCY[level] ?? URGENCY.planned;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold tracking-wide ${u.cls}`}
    >
      {u.dot && <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-current" />}
      {u.label}
    </span>
  );
}

const STATUS = {
  pending: { label: 'Searching donors', cls: 'bg-warning-tint text-warning', dot: true },
  inprogress: { label: 'Donor matched', cls: 'bg-info-tint text-info' },
  done: { label: 'Completed', cls: 'bg-success-tint text-success' },
  canceled: { label: 'Cancelled', cls: 'bg-surface text-muted line-through' },
};

export function StatusPill({ status = 'pending' }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[11px] font-semibold ${s.cls}`}
    >
      {s.dot && <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-current" />}
      {s.label}
    </span>
  );
}

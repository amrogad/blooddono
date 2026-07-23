import { useTranslation } from 'react-i18next';

// Urgency (of a need) and status (of a request) as pills.

const URGENCY = {
  critical: { cls: 'bg-crimson text-white', dot: true },
  urgent: { cls: 'bg-warning-tint text-warning' },
  planned: { cls: 'bg-surface text-body' },
  pastdue: { cls: 'bg-surface text-muted' },
};

export function UrgencyPill({ level = 'planned' }) {
  const { t } = useTranslation();
  const key = URGENCY[level] ? level : 'planned';
  const u = URGENCY[key];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold tracking-wide ${u.cls}`}
    >
      {u.dot && <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-current" />}
      {t(`urgency.${key}`)}
    </span>
  );
}

const STATUS = {
  pending: { cls: 'bg-warning-tint text-warning', dot: true },
  inprogress: { cls: 'bg-info-tint text-info' },
  done: { cls: 'bg-success-tint text-success' },
  canceled: { cls: 'bg-surface text-muted line-through' },
};

export function StatusPill({ status = 'pending' }) {
  const { t } = useTranslation();
  const key = STATUS[status] ? status : 'pending';
  const s = STATUS[key];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[11px] font-semibold ${s.cls}`}
    >
      {s.dot && <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-current" />}
      {t(`status.${key}`)}
    </span>
  );
}

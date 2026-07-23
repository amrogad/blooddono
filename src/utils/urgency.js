// Urgency + relative dates derived from a request's date/time. No new schema —
// donation_date already exists; this just reads it the way donors think.
// Day names/months come from i18n so dates localize with the rest of the UI
// (Western numerals kept — the months/weekdays are the only translated part).
import i18n from '../i18n';

export function requestDateTime(date, time) {
  const [y, m, d] = (date ?? '').split('-').map(Number);
  const [hh = 0, mm = 0] = (time ?? '').split(':').map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1, hh, mm);
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// level drives color/pill; sectionKey drives the Today / This week / Later grouping.
export function getUrgency(date, time, now = new Date()) {
  const target = requestDateTime(date, time);
  const hours = (target.getTime() - now.getTime()) / 3_600_000;
  const sameDay = startOfDay(target) === startOfDay(now);

  let level;
  if (hours < 0) level = 'pastdue';
  else if (hours < 24) level = 'critical';
  else if (hours <= 72) level = 'urgent';
  else level = 'planned';

  let sectionKey;
  if (hours < 24 || sameDay) sectionKey = 'today';
  else if (hours <= 24 * 7) sectionKey = 'week';
  else sectionKey = 'later';

  return { level, sectionKey };
}

// Day portion only — "Today", "Tomorrow", a weekday, or "20 Jul".
export function formatDay(date, time, now = new Date()) {
  const target = requestDateTime(date, time);
  const dayDiff = Math.round((startOfDay(target) - startOfDay(now)) / 86_400_000);

  if (dayDiff === 0) return i18n.t('date.today');
  if (dayDiff === 1) return i18n.t('date.tomorrow');
  const weekdays = i18n.t('date.weekdays', { returnObjects: true });
  const months = i18n.t('date.months', { returnObjects: true });
  if (dayDiff > 1 && dayDiff < 7) return weekdays[target.getDay()];
  return `${target.getDate()} ${months[target.getMonth()]}`;
}

// Human "needed by" line — day + time, never a raw ISO date.
export function formatNeededBy(date, time, now = new Date()) {
  const target = requestDateTime(date, time);
  const hhmm = `${String(target.getHours()).padStart(2, '0')}:${String(
    target.getMinutes(),
  ).padStart(2, '0')}`;
  return i18n.t('date.neededBy', { day: formatDay(date, time, now), time: hhmm });
}

import { useTranslation } from 'react-i18next';

const VARIANTS = {
  tint: 'bg-crimson-tint text-crimson',
  solid: 'bg-crimson text-white',
  ink: 'bg-ink text-on-ink',
  muted: 'bg-surface text-body',
};

// The blood-type square. Bricolage gives the letters brand character; the
// variant carries meaning — tint at rest, solid crimson when it's the urgent
// / patient's type, ink when selected as a filter. Pinned dir=ltr so A+/O-
// never reorder inside an RTL layout.
export default function BloodRoundel({ group, variant = 'tint', size = 52, className = '' }) {
  const { t } = useTranslation();
  return (
    <span
      dir="ltr"
      className={`inline-flex shrink-0 items-center justify-center font-display font-bold ${
        VARIANTS[variant] ?? VARIANTS.tint
      } ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(10, Math.round(size * 0.27)),
        fontSize: Math.round(size * 0.33),
        fontFamily: "'Bricolage Grotesque', ui-sans-serif, sans-serif",
      }}
      aria-label={group ? t('card.bloodTypeA11y', { group }) : undefined}
    >
      {group}
    </span>
  );
}

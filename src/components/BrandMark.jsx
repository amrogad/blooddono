import { useId } from 'react';

// The drop with a plus knocked out — giving blood adds life. Fill tracks the
// crimson token so it lifts in dark mode.
export default function BrandMark({ size = 30 }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <mask id={id}>
          <path
            d="M24 3.5 C29 11 36 16.5 36 25 A12 12 0 1 1 12 25 C12 16.5 19 11 24 3.5 Z"
            fill="#fff"
          />
          <rect x="17" y="22.6" width="14" height="4.8" rx="1.6" fill="#000" />
          <rect x="21.6" y="18" width="4.8" height="14" rx="1.6" fill="#000" />
        </mask>
      </defs>
      <rect width="48" height="48" mask={`url(#${id})`} fill="var(--color-crimson)" />
    </svg>
  );
}

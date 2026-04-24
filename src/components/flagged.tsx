import { cn } from '@societiza/lib/utils';
import { type SVGProps } from 'react';

export type FlaggedProps = SVGProps<SVGSVGElement>;

export function Flagged(props: FlaggedProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 180"
      className={cn('h-auto w-full', props.className)}
      role="img"
      {...props}
    >
      <title>Flagged</title>
      <rect x="36" y="20" width="12" height="140" rx="6" fill="#3f3d56" />
      <path
        d="M48 30c24 0 36-10 60-10 28 0 38 14 70 14v62c-32 0-42-14-70-14-24 0-36 10-60 10Z"
        fill="var(--color-primary)"
      />
      <circle cx="160" cy="132" r="28" fill="#e5e7eb" />
      <circle cx="196" cy="42" r="10" fill="#e5e7eb" />
      <circle cx="118" cy="138" r="8" fill="#d1d5db" />
    </svg>
  );
}

import { cn } from '@societiza/lib/utils';
import { type SVGProps } from 'react';

export type MasterPlanProps = SVGProps<SVGSVGElement>;

export function MasterPlan(props: MasterPlanProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 220"
      className={cn('h-auto w-full', props.className)}
      role="img"
      {...props}
    >
      <title>Master Plan</title>
      <rect x="20" y="24" width="280" height="172" rx="20" fill="#f4f4f5" />
      <rect x="44" y="50" width="92" height="56" rx="12" fill="#18181b" />
      <rect x="152" y="50" width="124" height="14" rx="7" fill="#d4d4d8" />
      <rect x="152" y="76" width="92" height="14" rx="7" fill="#e4e4e7" />
      <rect x="44" y="124" width="232" height="14" rx="7" fill="#d4d4d8" />
      <rect x="44" y="150" width="184" height="14" rx="7" fill="#e4e4e7" />
      <path
        d="M90 78 126 78"
        stroke="var(--color-primary)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="242" cy="150" r="22" fill="var(--color-primary)" />
      <path
        d="m232 150 7 7 13-16"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

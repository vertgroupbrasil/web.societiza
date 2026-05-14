import { cn } from '@societiza/lib/utils';
import { type SVGProps } from 'react';

export type OnlineFriendsProps = SVGProps<SVGSVGElement>;

export function OnlineFriends(props: OnlineFriendsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 120"
      className={cn('h-auto w-full', props.className)}
      role="img"
      {...props}
    >
      <title>Online Friends</title>
      <rect x="20" y="34" width="280" height="52" rx="26" fill="#18181b" />
      <circle cx="72" cy="60" r="22" fill="var(--color-primary)" />
      <circle cx="128" cy="60" r="22" fill="#f4f4f5" />
      <circle cx="184" cy="60" r="22" fill="#d4d4d8" />
      <circle cx="240" cy="60" r="22" fill="#a1a1aa" />
      <circle cx="88" cy="42" r="6" fill="#22c55e" />
      <circle cx="144" cy="42" r="6" fill="#22c55e" />
      <circle cx="200" cy="42" r="6" fill="#22c55e" />
      <circle cx="256" cy="42" r="6" fill="#22c55e" />
    </svg>
  );
}

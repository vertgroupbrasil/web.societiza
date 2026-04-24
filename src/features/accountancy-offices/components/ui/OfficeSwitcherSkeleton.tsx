import { Skeleton } from '@shadcn/index';

export function OfficeSwitcherSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Skeleton className="h-7 w-7 rounded-md" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  );
}

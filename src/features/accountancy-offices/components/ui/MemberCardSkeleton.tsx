import { Skeleton } from '@shadcn/index';

export function MemberCardSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}

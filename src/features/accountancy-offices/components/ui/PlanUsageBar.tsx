import { cn } from '@societiza/lib/utils';
import { Progress } from '@shadcn/index';

interface PlanUsageBarProps {
  label: string;
  current: number;
  max: number;
  className?: string;
}

export function PlanUsageBar({
  label,
  current,
  max,
  className,
}: PlanUsageBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isAtLimit = current >= max;
  const isNearLimit = percentage >= 80;

  const indicatorClass = isAtLimit
    ? '[&>div]:bg-red-500'
    : isNearLimit
      ? '[&>div]:bg-[#ff7a33]'
      : '[&>div]:bg-primary';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={cn(
            'font-medium tabular-nums',
            isAtLimit ? 'text-red-600' : 'text-foreground',
          )}
        >
          {current}/{max}
          {isAtLimit && (
            <span className="ml-1 text-xs text-red-500">— limite atingido</span>
          )}
        </span>
      </div>
      <Progress
        value={percentage}
        className={cn('h-1.5', indicatorClass)}
      />
    </div>
  );
}

import { Badge } from '@shadcn/index';
import { cn } from '@societiza/lib/utils';
import { PLAN_COLORS, PLAN_LABELS } from '../../constants/plans.constants';
import type { OfficePlan } from '../../schemas/office.schema';

interface PlanBadgeProps {
  plan: OfficePlan;
  className?: string;
  size?: 'sm' | 'md';
}

export function PlanBadge({ plan, className, size = 'md' }: PlanBadgeProps) {
  const colors = PLAN_COLORS[plan];
  const label = PLAN_LABELS[plan];

  return (
    <Badge
      variant="outline"
      className={cn(
        colors.bg,
        colors.text,
        colors.border,
        'font-medium border',
        size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0.5',
        className,
      )}
    >
      {label}
    </Badge>
  );
}

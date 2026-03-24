'use client';

import { Badge } from '@shadcn/index';
import { cn } from '@societiza/lib/utils';
import {
  TEMPLATE_STATUS_LABELS,
  TEMPLATE_STATUS_COLORS,
} from '../../constants/template.constants';
import type { TemplateStatus } from '../../server/types/template.types';

interface StatusBadgeProps {
  status: TemplateStatus;
  className?: string;
}

export function TemplateStatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(TEMPLATE_STATUS_COLORS[status], className)}
    >
      {TEMPLATE_STATUS_LABELS[status]}
    </Badge>
  );
}

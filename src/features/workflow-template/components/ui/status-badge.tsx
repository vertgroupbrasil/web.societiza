'use client';

import { Badge } from '@shadcn/index';
import { TEMPLATE_STATUS_LABELS } from '../../constants/template.constants';
import type { TemplateStatus } from '../../server/types/template.types';

interface StatusBadgeProps {
  status: TemplateStatus;
  className?: string;
}

export function TemplateStatusBadge({ status, className }: StatusBadgeProps) {
  const variant = status === 'Active' ? 'default' : 'secondary';

  return (
    <Badge variant={variant} className={className}>
      {TEMPLATE_STATUS_LABELS[status]}
    </Badge>
  );
}

'use client';

import { Card, CardContent, CardHeader, Progress } from '@shadcn/index';
import { CalendarDays } from 'lucide-react';
import { Status, StatusIndicator, StatusLabel } from '@kibo/index';
import { WORKFLOW_PROCESS_TYPE_LABELS } from '../constants';
import { getProgressPercentage } from '../lib';
import type { WorkflowProcessBoardItem } from '../server/types';

type WorkflowProcessCardProps = {
  item: WorkflowProcessBoardItem;
  onOpen: (processId: string) => void;
};

function getUrgency(
  item: WorkflowProcessBoardItem,
): 'normal' | 'warning' | 'urgent' | 'critical' {
  if (item.status === 'Completed') return 'normal';
  const pct = getProgressPercentage(item.completedSteps, item.totalSteps);
  if (pct >= 75) return 'warning';
  if (pct >= 40) return 'urgent';
  return 'critical';
}

const URGENCY_LABELS: Record<string, string> = {
  normal: 'Normal',
  warning: 'Atenção',
  urgent: 'Urgente',
  critical: 'Crítico',
};

export function WorkflowProcessCard({
  item,
  onOpen,
}: WorkflowProcessCardProps) {
  const progress = getProgressPercentage(item.completedSteps, item.totalSteps);
  const urgency = getUrgency(item);
  const daysElapsed = Math.ceil(
    (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className="w-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group bg-card/80 border-none backdrop-blur-sm outline-dashed outline-3 outline-foreground/10"
      onClick={() => onOpen(item.id)}
      tabIndex={0}
      role="button"
    >
      <CardHeader className="pb-3 space-y-3 min-w-0">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <h3 className="font-semibold text-sm leading-relaxed line-clamp-2 text-foreground min-w-0 flex-1 hyphens-auto">
              {item.targetClient}
            </h3>
            <div className="flex-shrink-0">
              <Status status={urgency}>
                <StatusIndicator />
                <StatusLabel>{URGENCY_LABELS[urgency]}</StatusLabel>
              </Status>
            </div>
          </div>
          <div className="min-w-0 w-full">
            <Status
              status="tipo"
              variant="secondary"
              className="text-xs w-fit max-w-full bg-muted text-muted-foreground border-border inline-block"
            >
              <span className="truncate block max-w-[240px]">
                {WORKFLOW_PROCESS_TYPE_LABELS[item.processType]}
              </span>
            </Status>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3 min-w-0">
        <div className="space-y-2 min-w-0">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs min-w-0 gap-2">
            <div className="flex items-center text-muted-foreground min-w-0 flex-1">
              <CalendarDays className="mr-1 h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {item.status === 'Completed'
                  ? 'Concluído'
                  : `${daysElapsed} dia${daysElapsed !== 1 ? 's' : ''} corridos`}
              </span>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {item.completedSteps}/{item.totalSteps} etapas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

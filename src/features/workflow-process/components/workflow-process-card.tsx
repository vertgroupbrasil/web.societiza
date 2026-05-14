'use client';

import { Card, CardContent, CardHeader, Progress } from '@shadcn/index';
import { CalendarDays } from 'lucide-react';
import { Status, StatusIndicator, StatusLabel } from '@kibo/index';
import { WORKFLOW_PROCESS_TYPE_LABELS } from '../constants';
import type { WorkflowProcessStepGroupItem } from '../server/types';

type WorkflowProcessCardProps = {
  item: WorkflowProcessStepGroupItem;
  onOpen: (processId: string) => void;
};

type Urgency = 'normal' | 'warning' | 'urgent' | 'critical';

function getUrgency(item: WorkflowProcessStepGroupItem): Urgency {
  if (item.processStatus === 'Completed') return 'normal';
  if (item.stepStatus === 'Completed') return 'warning';
  if (item.stepStatus === 'InProgress') return 'urgent';
  return 'critical';
}

function getStepProgress(item: WorkflowProcessStepGroupItem): number {
  if (item.processStatus === 'Completed') return 100;
  if (item.stepStatus === 'Completed') return 75;
  if (item.stepStatus === 'InProgress') return 40;
  return 10;
}

const URGENCY_LABELS: Record<Urgency, string> = {
  normal: 'Concluído',
  warning: 'Atenção',
  urgent: 'Em andamento',
  critical: 'Não iniciado',
};

export function WorkflowProcessCard({
  item,
  onOpen,
}: WorkflowProcessCardProps) {
  const urgency = getUrgency(item);
  const progress = getStepProgress(item);
  const daysElapsed = Math.ceil(
    (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <Card
      className="w-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group bg-card/80 border-none backdrop-blur-sm outline-dashed outline-3 outline-foreground/10"
      onClick={() => onOpen(item.processId)}
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
                {item.processStatus === 'Completed'
                  ? 'Concluído'
                  : `${daysElapsed} dia${daysElapsed !== 1 ? 's' : ''} corridos`}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

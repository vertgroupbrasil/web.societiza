'use client';

import React from 'react';
import {
  calculateProgressData,
  type Process,
  ProcessProgressBar,
} from '@corporate/index';
import { Card, CardHeader, CardContent } from '@shadcn/index';
import { Status, StatusIndicator, StatusLabel, TaskStatus } from '@kibo/index';
import { Building2, CalendarDays } from 'lucide-react';

interface ProcessCardProps {
  process: Process;
  onClick?: (process: Process) => void;
}

export const ProcessCard = React.memo(
  ({ process, onClick }: ProcessCardProps) => {
    const progressData = calculateProgressData(process);

    const processTypeDescription =
      process.tipo_processo?.descricao || 'Carregando...';

    const isExpired = progressData.isExpired;
    const daysRemaining = progressData.daysRemaining;

    return (
      <Card
        className="w-full overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group bg-card/80 border-none backdrop-blur-sm outline-dashed outline-3 outline-foreground/10"
        onClick={() => onClick?.(process)}
        tabIndex={0}
        role="button"
        aria-pressed="false"
      >
        <CardHeader className="pb-3 space-y-3 min-w-0">
          {/* Header com título e tipo */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <h3 className="font-semibold text-sm leading-relaxed line-clamp-2 text-foreground min-w-0 flex-1 hyphens-auto">
                {process.nome}
              </h3>
              <div className="flex-shrink-0">
                <Status status={progressData.urgency}>
                  <StatusIndicator />
                  <StatusLabel />
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
                  {processTypeDescription}
                </span>
              </Status>
            </div>
          </div>
          <div className="flex items-start text-xs text-muted-foreground min-w-0 gap-1">
            <Building2 className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="truncate min-w-0 leading-relaxed">
              {process.contabilidade?.nome || 'Não definido'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3 min-w-0">
          <div className="space-y-2 min-w-0">
            <ProcessProgressBar
              createdAt={process.created_at}
              expireAt={process.expire_at}
            />
            <div className="flex items-center justify-between text-xs min-w-0 gap-2">
              <div className="flex items-center text-muted-foreground min-w-0 flex-1">
                <CalendarDays className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {isExpired ? 'Expirado há' : 'Expira em'}{' '}
                  {Math.abs(daysRemaining)} dia
                  {Math.abs(daysRemaining) !== 1 ? 's' : ''}
                </span>
              </div>
              {isExpired && (
                <div className="flex-shrink-0">
                  <TaskStatus.expired className="text-xs" />
                </div>
              )}
            </div>
          </div>
          {process.observacao && (
            <div className="border-t pt-2 min-w-0">
              <p className="text-xs text-muted-foreground line-clamp-3 break-all leading-relaxed">
                {process.observacao}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

ProcessCard.displayName = 'ProcessCard';

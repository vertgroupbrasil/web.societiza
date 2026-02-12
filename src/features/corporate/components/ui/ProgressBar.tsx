import React from 'react';
import { cn } from '@flowtec/lib/utils';
import { CORPORATE_URGENCY_THRESHOLDS, ensureDate } from '@corporate/index';

interface ProcessProgressBarProps {
  expireAt: Date | string | null;
  createdAt: Date | string;
  className?: string;
  showPercentage?: boolean;
}

export const ProcessProgressBar = React.memo(
  ({
    expireAt,
    createdAt,
    className,
    showPercentage = false,
  }: ProcessProgressBarProps) => {
    const calculateProgress = () => {
      const now = new Date();
      const expireDate = ensureDate(expireAt);
      const createdDate = ensureDate(createdAt);

      if (!expireDate || !createdDate) return 0;

      const totalTime = expireDate.getTime() - createdDate.getTime();
      const elapsedTime = now.getTime() - createdDate.getTime();
      return Math.min(Math.max(elapsedTime / totalTime, 0), 1);
    };

    const getProgressClasses = (progress: number) => {
      if (progress >= CORPORATE_URGENCY_THRESHOLDS.critical) {
        return 'bg-red-500'; // crítico
      }
      if (progress >= CORPORATE_URGENCY_THRESHOLDS.urgent) {
        return 'bg-orange-500'; // urgente
      }
      if (progress >= CORPORATE_URGENCY_THRESHOLDS.warning) {
        return 'bg-yellow-500'; // atenção
      }
      return 'bg-green-500'; // seguro
    };

    const progress = calculateProgress();
    const percentage = Math.round(progress * 100);
    const progressColorClass = getProgressClasses(progress);

    return (
      <div className={cn('space-y-1', className)}>
        <div className="w-full bg-accent rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              progressColorClass,
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <div className="text-xs text-muted-foreground text-right">
            {percentage}% concluído
          </div>
        )}
      </div>
    );
  },
);

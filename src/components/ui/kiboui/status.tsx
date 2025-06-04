import { Badge } from '@flowtec/components/ui/shadcnui/badge';
import { cn } from '@flowtec/lib/utils';
import type { ComponentProps, HTMLAttributes } from 'react';
export type StatusProps = ComponentProps<typeof Badge> & {
  status: string;
};
export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    variant="secondary"
    className={cn('flex items-center gap-2', 'group', status, className)}
    {...props}
  />
);
export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className="relative flex h-2 w-2" {...props}>
    <span
      className={cn(
        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
        'group-[.ativa]:bg-emerald-500',
        'group-[.suspensa]:bg-yellow-500',
        'group-[.inapta]:bg-rose-500',
        'group-[.baixada]:bg-red-500',
        'group-[.nula]:bg-blue-500',
        'group-[.inativa]:bg-amber-500',
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        'group-[.ativa]:bg-emerald-500',
        'group-[.baixada]:bg-red-500',
        'group-[.inapta]:bg-rose-500',
        'group-[.nula]:bg-blue-500',
        'group-[.inativa]:bg-amber-500',
        'group-[.suspensa]:bg-yellow-500',
      )}
    />
  </span>
);
export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;
export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn('text-muted-foreground', className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.ativa]:block">Ativa</span>
        <span className="hidden group-[.baixada]:block">Baixada</span>
        <span className="hidden group-[.inapta]:block">Inapta</span>
        <span className="hidden group-[.suspensa]:block">Suspensa</span>
        <span className="hidden group-[.nula]:block">Nula</span>
        <span className="hidden group-[.inativa]:block">Inativa</span>
      </>
    )}
  </span>
);

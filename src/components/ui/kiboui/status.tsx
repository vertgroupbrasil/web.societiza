import { Badge } from '@shadcn/index';
import { cn } from '@societiza/lib/utils';
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
        // Status originais
        'group-[.ativa]:bg-emerald-500',
        'group-[.suspensa]:bg-yellow-500',
        'group-[.inapta]:bg-rose-500',
        'group-[.baixada]:bg-red-500',
        'group-[.nula]:bg-blue-500',
        'group-[.inativa]:bg-amber-500',
        // Novos status para TaskChecklist
        'group-[.concluida]:bg-emerald-500',
        'group-[.pendente]:bg-orange-500',
        'group-[.bloqueada]:bg-gray-500',
        'group-[.nao-aplicavel]:bg-purple-500',
        'group-[.obrigatoria]:bg-red-500',
        'group-[.opcional]:bg-blue-500',
        'group-[.expirada]:bg-rose-500',
        // Novos estados para ProcessCard e TaskItem
        'group-[.critical]:bg-red-500',
        'group-[.urgent]:bg-orange-500',
        'group-[.warning]:bg-yellow-500',
        'group-[.normal]:bg-green-500',
        'group-[.syncing]:bg-blue-500',
        'group-[.tipo]:bg-gray-500',
        'group-[.expire-date]:bg-gray-500',
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        // Status originais
        'group-[.ativa]:bg-emerald-500',
        'group-[.baixada]:bg-red-500',
        'group-[.inapta]:bg-rose-500',
        'group-[.nula]:bg-blue-500',
        'group-[.inativa]:bg-amber-500',
        'group-[.suspensa]:bg-yellow-500',
        // Novos status para TaskChecklist
        'group-[.concluida]:bg-emerald-500',
        'group-[.pendente]:bg-orange-500',
        'group-[.bloqueada]:bg-gray-500',
        'group-[.nao-aplicavel]:bg-purple-500',
        'group-[.obrigatoria]:bg-red-500',
        'group-[.opcional]:bg-blue-500',
        'group-[.expirada]:bg-rose-500',
        // Novos estados para ProcessCard e TaskItem
        'group-[.critical]:bg-red-500',
        'group-[.urgent]:bg-orange-500',
        'group-[.warning]:bg-yellow-500',
        'group-[.normal]:bg-green-500',
        'group-[.syncing]:bg-blue-500',
        'group-[.tipo]:bg-gray-500',
        'group-[.expire-date]:bg-gray-500',
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
  <span
    className={cn('text-muted-foreground text-xs font-medium', className)}
    {...props}
  >
    {children ?? (
      <>
        {/* Labels originais */}
        <span className="hidden group-[.ativa]:block">Ativa</span>
        <span className="hidden group-[.baixada]:block">Baixada</span>
        <span className="hidden group-[.inapta]:block">Inapta</span>
        <span className="hidden group-[.suspensa]:block">Suspensa</span>
        <span className="hidden group-[.nula]:block">Nula</span>
        <span className="hidden group-[.inativa]:block">Inativa</span>
        {/* Novos labels para TaskChecklist */}
        <span className="hidden group-[.concluida]:block">Concluída</span>
        <span className="hidden group-[.pendente]:block">Pendente</span>
        <span className="hidden group-[.bloqueada]:block">Bloqueada</span>
        <span className="hidden group-[.nao-aplicavel]:block">N/A</span>
        <span className="hidden group-[.obrigatoria]:block">Obrigatória</span>
        <span className="hidden group-[.opcional]:block">Opcional</span>
        <span className="hidden group-[.expirada]:block">Expirada</span>
        {/* Novos labels para ProcessCard */}
        <span className="hidden group-[.critical]:block">Crítico</span>
        <span className="hidden group-[.urgent]:block">Urgente</span>
        <span className="hidden group-[.warning]:block">Atenção</span>
        <span className="hidden group-[.normal]:block">Normal</span>
        <span className="hidden group-[.syncing]:block">Sincronizando...</span>
        <span className="hidden group-[.tipo]:block">Tipo</span>
        <span className="hidden group-[.expire-date]:block">Expira em</span>
      </>
    )}
  </span>
);

// Presets específicos para TaskChecklist (NOVOS)
export const TaskStatus = {
  completed: (props?: Partial<StatusProps>) => (
    <Status
      status="concluida"
      className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  pending: (props?: Partial<StatusProps>) => (
    <Status
      status="pendente"
      className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  blocked: (props?: Partial<StatusProps>) => (
    <Status
      status="bloqueada"
      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  notApplicable: (props?: Partial<StatusProps>) => (
    <Status
      status="nao-aplicavel"
      className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  required: (props?: Partial<StatusProps>) => (
    <Status
      status="obrigatoria"
      className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  optional: (props?: Partial<StatusProps>) => (
    <Status
      status="opcional"
      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),

  expired: (props?: Partial<StatusProps>) => (
    <Status
      status="expirada"
      className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/30"
      {...props}
    >
      <StatusIndicator />
      <StatusLabel />
    </Status>
  ),
};

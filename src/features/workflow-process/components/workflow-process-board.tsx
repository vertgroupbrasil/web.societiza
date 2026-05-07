'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@shadcn/index';
import { AlertCircle, Filter, Layers, Search } from 'lucide-react';
import { accountancyQueryKeys } from '@societiza/features/accountancy/hooks/queries/useAccountancyQueries';
import { accountancyService } from '@societiza/features/accountancy/server/services/accountancy.service';
import { useCurrentUser } from '@societiza/hooks/useCurrentUser';
import { useMyProfile } from '@societiza/features/identity-users/hooks/queries/useIdentityUserQueries';
import { useWorkflowTemplates } from '@societiza/features/workflow-template/hooks/queries/use-workflow-template-queries';
import { WORKFLOW_PROCESS_TYPE_OPTIONS } from '../constants';
import { useWorkflowProcessBoardBySteps } from '../hooks/queries';
import type { WorkflowProcessType } from '../server/types';
import { CreateWorkflowProcessDialog } from './create-workflow-process-dialog';
import { WorkflowProcessColumn } from './workflow-process-column';
import { WorkflowProcessDrawer } from './workflow-process-drawer';

type ProcessTypeFilter = WorkflowProcessType | 'all';

export function WorkflowProcessBoard() {
  const currentUser = useCurrentUser();
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile(
    Boolean(currentUser),
  );
  const role = profile?.role ?? currentUser?.role;
  const isSystemAdmin = role === 'SystemAdmin';
  const [selectedAccountancyId, setSelectedAccountancyId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('all');
  const [processTypeFilter, setProcessTypeFilter] =
    useState<ProcessTypeFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcessId, setSelectedProcessId] = useState<string>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const systemAccountancies = useQuery({
    queryKey: accountancyQueryKeys.list(1, 100),
    queryFn: () => accountancyService.list(1, 100),
    enabled: isSystemAdmin,
  });

  useEffect(() => {
    if (
      isSystemAdmin &&
      !selectedAccountancyId &&
      systemAccountancies.data?.items[0]
    ) {
      setSelectedAccountancyId(systemAccountancies.data.items[0].id);
    }
  }, [isSystemAdmin, selectedAccountancyId, systemAccountancies.data?.items]);

  const accountancyId = isSystemAdmin
    ? selectedAccountancyId
    : (profile?.accountancyId ?? currentUser?.accountancyId);

  const templateIdParam = selectedTemplateId !== 'all' ? selectedTemplateId : undefined;
  const board = useWorkflowProcessBoardBySteps(accountancyId, templateIdParam);

  const { data: templatesPage } = useWorkflowTemplates();
  const activeTemplates = (templatesPage?.items ?? []).filter(
    (t) => t.status === 'Active',
  );

  // Build columns from server-grouped data, applying client-side filters.
  // All step groups are always rendered (even when processes is empty after filtering).
  const columns = useMemo(() => {
    const groups = board.data?.items ?? [];
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...groups]
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map((group) => {
        let processes = group.processes;

        if (processTypeFilter !== 'all') {
          processes = processes.filter(
            (p) => p.processType === processTypeFilter,
          );
        }

        if (normalizedSearch) {
          processes = processes.filter((p) =>
            p.targetClient.toLowerCase().includes(normalizedSearch),
          );
        }

        return { title: group.stepTitle, order: group.stepOrder, items: processes };
      });
  }, [board.data?.items, processTypeFilter, searchTerm]);

  const totalProcesses = useMemo(
    () => columns.reduce((acc, col) => acc + col.items.length, 0),
    [columns],
  );

  const activeFilterCount = [
    processTypeFilter !== 'all',
    selectedTemplateId !== 'all',
  ].filter(Boolean).length;

  const openProcess = (processId: string) => {
    setSelectedProcessId(processId);
    setIsDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) setSelectedProcessId(undefined);
  };

  const isLoadingAccountancy =
    isLoadingProfile || systemAccountancies.isLoading;
  const hasAccountancyContext = Boolean(accountancyId);

  return (
    <>
      <div className="h-full w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="w-full max-w-full px-4 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between gap-4 w-full min-w-0 pt-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground truncate">
                Societário
              </h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                {isSystemAdmin ? (
                  <Select
                    value={selectedAccountancyId}
                    onValueChange={setSelectedAccountancyId}
                    disabled={systemAccountancies.isLoading}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecione contabilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {(systemAccountancies.data?.items ?? []).map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.tradeName ?? acc.legalName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
                <CreateWorkflowProcessDialog
                  accountancyId={accountancyId}
                  onCreated={openProcess}
                />
              </div>
            </div>

            {/* Search + Filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0 pb-4">
              <div className="flex-1 max-w-full sm:max-w-md min-w-0 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, contabilidade..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-dashed border-border/70 bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {activeTemplates.length > 0 && (
                  <Select
                    value={selectedTemplateId}
                    onValueChange={setSelectedTemplateId}
                  >
                    <SelectTrigger className="w-auto gap-2 border-dashed border-border/70">
                      <Layers className="h-4 w-4" />
                      {selectedTemplateId === 'all'
                        ? 'Todos os templates'
                        : (activeTemplates.find((t) => t.id === selectedTemplateId)?.name ?? 'Template')}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os templates</SelectItem>
                      {activeTemplates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select
                  value={processTypeFilter}
                  onValueChange={(v) =>
                    setProcessTypeFilter(v as ProcessTypeFilter)
                  }
                >
                  <SelectTrigger className="w-auto gap-2 border-dashed border-border/70">
                    <Filter className="h-4 w-4" />
                    Filtros
                    {activeFilterCount > 0 ? (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {activeFilterCount}
                      </Badge>
                    ) : null}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {WORKFLOW_PROCESS_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban area */}
        <div className="flex-1 min-h-0 w-full relative">
          <div className="absolute inset-0 overflow-x-auto">
            {isLoadingAccountancy || board.isLoading ? (
              <div className="flex gap-6 h-full w-max min-w-full p-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80 h-full">
                    <Skeleton className="h-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : !hasAccountancyContext ? (
              <div className="flex items-center justify-center h-full">
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma contabilidade selecionada.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : board.isError ? (
              <div className="flex items-center justify-center h-full p-6">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Erro ao carregar processos</AlertTitle>
                  <AlertDescription>
                    <p>Não foi possível buscar os processos societários.</p>
                    <Button
                      className="mt-3"
                      variant="outline"
                      onClick={() => board.refetch()}
                    >
                      Tentar novamente
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="flex gap-6 h-full w-max min-w-full p-4">
                {columns.map((col) => (
                  <WorkflowProcessColumn
                    key={`${col.order}-${col.title}`}
                    column={col}
                    onOpenProcess={openProcess}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 w-full border-t bg-background/95 backdrop-blur overflow-hidden">
          <div className="px-4 py-2 max-w-full">
            <div className="text-center text-xs sm:text-sm text-muted-foreground truncate">
              Mostrando{' '}
              <span className="font-bold">{totalProcesses}</span>{' '}
              <span className="font-medium">
                processo{totalProcesses !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <WorkflowProcessDrawer
        processId={selectedProcessId}
        open={isDrawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}

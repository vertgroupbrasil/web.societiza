// edit-process-form.tsx
'use client';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Button,
  ScrollArea,
  Badge,
  Card,
  CardContent,
  Progress,
  Avatar,
  AvatarFallback,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Input,
} from '@shadcn/index';
import {
  Pencil,
  Building,
  Trash2,
  RotateCcw,
  ExternalLink,
  Clock,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  type ProcessTypes,
  type Process,
  type Tasks,
  useEditProcessForm,
  useTaskSequentialLogic,
  useCorporateMutations,
  TaskChecklist,
  formatDate,
  isValidUrl,
} from '@workflow/index';
import { toast } from 'sonner';

interface EditProcessFormProps {
  process: Process;
  processTypes: ProcessTypes;
  onSuccess?: () => void;
  onDelete?: (deleteCallback: () => Promise<void>) => void; // ✅ Corrigir tipo
  onClose?: () => void;
}

export function EditProcessForm({
  process,
  processTypes,
  onSuccess,
  onDelete,
}: EditProcessFormProps) {
  const { form, onSubmit, updateTask, updateTipoTributacao, tipoTributacao } =
    useEditProcessForm({
      process,
      onSuccess,
    });

  const { deleteProcess } = useCorporateMutations();

  const [isEditing, setIsEditing] = React.useState(false);
  const [originalValues, setOriginalValues] = React.useState({
    nome: '',
    tipo_processo_id: '',
    observacao: '',
  });
  const [collapsedStages, setCollapsedStages] = React.useState<Set<string>>(
    new Set(),
  );

  const processStats = React.useMemo(() => {
    const allTasks = process.tarefas || [];
    const completedTasks = allTasks.filter(
      (t) => t.concluida || t.nao_aplicavel,
    );
    const progress =
      allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

    const urgentTasks = allTasks.filter((t) => {
      if (!t.expire_at) return false;
      const expireDate = new Date(t.expire_at);
      const today = new Date();
      const diffDays = Math.ceil(
        (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays <= 3 && diffDays >= 0 && !t.concluida && !t.nao_aplicavel;
    });

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      progress: Math.round(progress),
      urgentTasks: urgentTasks.length,
    };
  }, [process.tarefas]);

  const processType = React.useMemo(() => {
    return processTypes?.tipo_processo?.find(
      (pt) => pt.id === process.tipo_processo?.id,
    );
  }, [processTypes, process.tipo_processo]);

  const processWithFormTasks: Process = React.useMemo(() => {
    const formTarefas = form.watch('tarefas') || [];
    const updated: Tasks[] =
      process.tarefas?.map((orig) => {
        const ft = formTarefas.find((f: any) => f.id === orig.id);
        if (!ft) return orig;
        return {
          ...orig,
          concluida: ft.concluida === 'True',
          nao_aplicavel: ft.nao_aplicavel === 'True',
          expire_at: ft.expire_at
            ? new Date(`${ft.expire_at}T12:00:00`)
            : orig.expire_at,
        };
      }) || [];
    return { ...process, tarefas: updated };
  }, [process, form]);

  const taskLogic = useTaskSequentialLogic(
    processWithFormTasks,
    processWithFormTasks.tarefas,
  );

  const enterEditMode = React.useCallback(() => {
    setOriginalValues({
      nome: form.getValues('nome') || '',
      tipo_processo_id: form.getValues('tipo_processo_id') || '',
      observacao: form.getValues('observacao') || '',
    });
    setIsEditing(true);
  }, [form]);

  const cancelEdit = React.useCallback(() => {
    form.setValue('nome', originalValues.nome);
    form.setValue('tipo_processo_id', originalValues.tipo_processo_id);
    form.setValue('observacao', originalValues.observacao);
    setIsEditing(false);
  }, [form, originalValues]);

  const handleDelete = React.useCallback(() => {
    // ✅ Função async que retorna Promise<void>
    const actualDelete = async (): Promise<void> => {
      try {
        await deleteProcess.mutateAsync(process.id);
        toast.success('Sucesso ao deletar o processo!', {
          description: `O processo ${process.nome} foi removido com sucesso.`,
        });
        onSuccess?.();
      } catch (err) {
        toast.error('Erro ao deletar processo');
        throw err; // ✅ Re-throw para que o caller possa lidar com o erro
      }
    };

    onDelete?.(actualDelete);
  }, [onDelete, process.id, process.nome, onSuccess, deleteProcess]);

  const handleTaskUpdate = React.useCallback(
    (
      taskId: string,
      updates: {
        concluida?: boolean;
        nao_aplicavel?: boolean;
        expire_at?: string;
      },
    ) => updateTask(taskId, updates),
    [updateTask],
  );

  const toggleStageCollapse = React.useCallback((id: string) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit();
      setIsEditing(false);
    },
    [onSubmit],
  );

  React.useEffect(() => {
    if (process.etapa?.id && collapsedStages.has(process.etapa.id)) {
      setCollapsedStages((s) => {
        const next = new Set(s);
        next.delete(process.etapa.id);
        return next;
      });
    }
  }, [process.etapa?.id, collapsedStages]);

  if (!processTypes?.tipo_processo?.length) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <p className="text-sm text-yellow-700">
            Nenhum tipo de processo disponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <div className="flex flex-col h-full">
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Building className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    {process.nome || 'Processo sem nome'}
                  </h1>
                  <p className="text-sm text-muted-foreground italic">
                    {process?.contabilidade?.nome || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {isEditing ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={cancelEdit}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancelar</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={enterEditMode}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Editar</TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      disabled={deleteProcess.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <form
            id="edit-process-form"
            onSubmit={handleSubmit}
            className="flex flex-col flex-1"
          >
            {/* resto do código igual... */}
            <div className="p-4 space-y-4">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">Dias corridos</span>
                    </div>
                    <p className="text-lg font-bold">
                      {process.created_at
                        ? Math.ceil(
                            (new Date().getTime() -
                              new Date(process.created_at).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                        : 0}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Tipo de processo
                      </span>
                    </div>
                    <p className="text-sm font-semibold">
                      {processType?.descricao || 'Não informado'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Data de início
                      </span>
                    </div>
                    <p className="text-sm font-semibold">
                      {process.created_at
                        ? formatDate(process.created_at)
                        : 'Não informado'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Data de expiração
                      </span>
                    </div>
                    <p className="text-sm font-semibold">
                      {(() => {
                        const remainingTasks =
                          processStats.totalTasks - processStats.completedTasks;
                        if (remainingTasks === 0) return 'Concluído';

                        const estimatedDays = remainingTasks * 3;
                        const expectedDate = new Date();
                        expectedDate.setDate(
                          expectedDate.getDate() + estimatedDays,
                        );
                        return formatDate(expectedDate);
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Link da Viabilidade</h3>
                </div>
                <FormField
                  control={form.control}
                  name="observacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        {isEditing ? (
                          <Input
                            placeholder="https://viabilidade.com/exemplo"
                            value={field.value || ''}
                            onChange={field.onChange}
                            className="text-sm"
                          />
                        ) : (
                          <div className="min-h-[36px] p-2 border rounded-md bg-muted/30 flex items-center">
                            {field.value && isValidUrl(field.value) ? (
                              <a
                                href={field.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary truncate hover:underline flex items-center space-x-1"
                              >
                                <span className="truncate max-w-2">
                                  {field.value}
                                </span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {field.value ||
                                  'Entre no modo edição para adicionar um link'}
                              </span>
                            )}
                          </div>
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Progresso
                  </span>
                  <span className="text-xs font-medium">
                    {processStats.progress}%
                  </span>
                </div>
                <Progress value={processStats.progress} className="h-2" />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">Tarefas</h2>
                  <Badge variant="outline" className="text-xs">
                    {processStats.completedTasks} de {processStats.totalTasks}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  <TaskChecklist
                    process={processWithFormTasks}
                    taskLogic={taskLogic}
                    onTaskUpdate={handleTaskUpdate}
                    onTipoTributacaoChange={updateTipoTributacao}
                    tipoTributacao={tipoTributacao}
                    showHeader={false}
                    showProgress={false}
                    showStageGrouping
                    useCollapsible
                    collapsedStages={collapsedStages}
                    onToggleStage={toggleStageCollapse}
                    currentStageId={process.etapa?.id}
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              </ScrollArea>
            </div>
          </form>
        </div>
      </Form>
    </TooltipProvider>
  );
}

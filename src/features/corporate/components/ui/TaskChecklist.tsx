'use client';

import React from 'react';
import { Target, ChevronRight, CheckCircle } from 'lucide-react';
import { cn } from '@societiza/lib/utils';
import { motion } from 'framer-motion';
import {
  type Process,
  type Tasks,
  TaskItem,
  type TaskLogic,
} from '@corporate/index';
import {
  Badge,
  Card,
  CardContent,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormLabel,
} from '@shadcn/index';
import { Status } from '@societiza/components/ui/kiboui';

interface TaskChecklistProps {
  process?: Process;
  taskLogic: TaskLogic;
  onTaskUpdate?: (
    taskId: string,
    updates: {
      concluida?: boolean;
      nao_aplicavel?: boolean;
      expire_at?: string;
      tipo_tributacao?: string;
    },
  ) => void;
  onTipoTributacaoChange?: (tipo: string) => void;
  tipoTributacao?: string;
  className?: string;
  // ✅ Adicionar as props que estavam faltando
  showHeader?: boolean;
  showProgress?: boolean;
  showStageGrouping?: boolean;
  showNextAvailable?: boolean;
  showInfoTip?: boolean;
  useCollapsible?: boolean;
  collapsedStages?: Set<string>;
  onToggleStage?: (stageId: string) => void;
  currentStageId?: string;
}

export const TaskChecklist = React.memo<TaskChecklistProps>(
  ({
    process,
    taskLogic,
    onTaskUpdate = () => {},
    onTipoTributacaoChange = () => {},
    tipoTributacao = 'simples',
    className,
    showHeader = true, // ✅ Valor padrão
    showProgress = true, // ✅ Valor padrão
    showStageGrouping = true,
    showNextAvailable = true, // ✅ Valor padrão
    showInfoTip = true, // ✅ Valor padrão
    useCollapsible = false,
    collapsedStages = new Set(),
    onToggleStage = () => {},
    currentStageId,
  }) => {
    const isTribStage = (name: string) =>
      ['tributação', 'tributacao', 'nf'].some((k) =>
        name.toLowerCase().includes(k),
      );

    const isSimplesTask = (t: Tasks) => {
      const d = t.tarefa.descricao.toLowerCase();
      return (
        d.includes('simples solicitado') || d.includes('resultado simples')
      );
    };

    const filterTasks = (tasks: Tasks[]) =>
      tipoTributacao === 'simples'
        ? tasks
        : tasks.filter((t) => !isSimplesTask(t));

    const handleTipoChange = (novo: string) => {
      onTipoTributacaoChange(novo);
      process?.tarefas.forEach((t) =>
        onTaskUpdate(t.id, { tipo_tributacao: novo }),
      );
      if (novo !== 'simples') {
        process?.tarefas.forEach((t) => {
          if (isSimplesTask(t))
            onTaskUpdate(t.id, { nao_aplicavel: true, concluida: false });
        });
      } else {
        process?.tarefas.forEach((t) => {
          if (isSimplesTask(t) && t.nao_aplicavel)
            onTaskUpdate(t.id, { nao_aplicavel: false });
        });
      }
    };

    const handleToggle = (id: string, task: Tasks) => {
      if (task.concluida) {
        if (!taskLogic.canUnmarkTask(id)) return;
        onTaskUpdate(id, {
          concluida: false,
          nao_aplicavel: false,
          expire_at: '',
        });
      } else if (taskLogic.canCompleteTask(id)) {
        onTaskUpdate(id, { concluida: true, nao_aplicavel: false });
      }
    };

    const handleNAToggle = (id: string, task: Tasks) => {
      if (task.nao_aplicavel) {
        onTaskUpdate(id, { nao_aplicavel: false, concluida: false });
      } else if (taskLogic.canMarkNotApplicable(id)) {
        onTaskUpdate(id, {
          nao_aplicavel: true,
          concluida: false,
          expire_at: '',
        });
      }
    };

    const handleDateChange = (id: string, date: string | null) => {
      if (date) {
        onTaskUpdate(id, {
          expire_at: date,
          concluida: true,
          nao_aplicavel: false,
        });
      } else {
        onTaskUpdate(id, { expire_at: '' });
      }
    };

    const getStatus = (t: Tasks) => {
      if (t.concluida) return 'completed';
      if (t.nao_aplicavel) return 'not-applicable';
      if (taskLogic.isTaskBlocked(t.id)) return 'blocked';
      if (t.expire_at) {
        const d = new Date(t.expire_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        if (d < today) return 'expired';
        const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
        if (diff <= 3) return 'expiring-soon';
      }
      return 'pending';
    };

    const StatusIcon = ({ task }: { task: Tasks }) => {
      const s = getStatus(task);
      switch (s) {
        case 'completed':
          return <Status status="completed" />;
        case 'not-applicable':
          return <Status status="not-applied" />;
        case 'blocked':
          return <Status status="blocked" />;
        case 'expired':
          return <Status status="ex" />;
        case 'expiring-soon':
          return <Status status="warning" />;
        default:
          return task.tarefa.obrigatoria ? (
            <Status status="obrigatoria" />
          ) : (
            <Status status="optional" />
          );
      }
    };

    const tasksByStage = React.useMemo(() => {
      if (!process?.tarefas) return [];
      const grouped = new Map<string, { stage: any; tasks: Tasks[] }>();
      process.tarefas.forEach((t) => {
        const id = t.etapa.id;
        if (!grouped.has(id)) grouped.set(id, { stage: t.etapa, tasks: [] });
        grouped.get(id)!.tasks.push(t);
      });
      return [...grouped.values()]
        .sort((a, b) => a.stage.ordem - b.stage.ordem)
        .map(({ stage, tasks }) => ({
          stage,
          tasks: tasks.sort((a, b) => a.sequencia - b.sequencia),
        }));
    }, [process?.tarefas]);

    const renderStage = ({
      stage,
      tasks,
      idx,
    }: {
      stage: any;
      tasks: Tasks[];
      idx: number;
    }) => {
      const trib = isTribStage(stage.nome);
      const visible = trib ? filterTasks(tasks) : tasks;
      const done = visible.filter((t) => t.concluida || t.nao_aplicavel).length;
      const complete = done === visible.length;
      const current = currentStageId === stage.id;

      const StageHeader = (
        <div
          className={cn(
            'flex items-center justify-between p-4 rounded-lg border cursor-pointer',
            'hover:bg-accent/50',
            current && 'bg-primary/5 border-primary/20',
            !current && 'border-border',
            complete && 'bg-completed border-completed-border',
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {useCollapsible && (
                <motion.div
                  animate={{ rotate: collapsedStages.has(stage.id) ? 0 : 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
              <span className="text-sm font-medium">
                {stage.ordem}. {stage.nome}
              </span>
            </div>
            {current && <Badge className="text-xs">Atual</Badge>}
            {complete && (
              <CheckCircle className="h-4 w-4 text-completed-foreground" />
            )}
          </div>
          <Badge variant="outline" className="text-xs border-foreground">
            {done}/{visible.length}
          </Badge>
        </div>
      );

      const Content = (
        <>
          {trib && (
            <div className="mb-4 p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-950/10">
              <FormLabel className="text-sm font-medium mb-2 block">
                Tipo de tributação *
              </FormLabel>
              <Select value={tipoTributacao} onValueChange={handleTipoChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de tributação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="lucro">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Valor atual: {tipoTributacao}
              </p>
            </div>
          )}

          {visible.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <TaskItem
                task={t}
                taskLogic={taskLogic}
                onToggle={handleToggle}
                onMarkNA={handleNAToggle}
                onDateChange={handleDateChange}
                getStatusComponent={() => <StatusIcon task={t} />}
                variant="minimal"
                hideNAButton={trib && isSimplesTask(t)}
              />
            </motion.div>
          ))}
        </>
      );

      return useCollapsible ? (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <Collapsible onOpenChange={() => onToggleStage(stage.id)}>
            <CollapsibleTrigger asChild>{StageHeader}</CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {Content}
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      ) : (
        <div key={stage.id} className="space-y-3">
          {StageHeader}
          {Content}
        </div>
      );
    };

    if (!process?.tarefas?.length) {
      return (
        <Card className={className}>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Nenhuma tarefa definida para este processo.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={cn('space-y-3', className)}>
        {showStageGrouping ? (
          <div className="space-y-4">
            {tasksByStage.map((s, i) =>
              renderStage({ stage: s.stage, tasks: s.tasks, idx: i }),
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {process.tarefas.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                taskLogic={taskLogic}
                onToggle={handleToggle}
                onMarkNA={handleNAToggle}
                onDateChange={handleDateChange}
                getStatusComponent={() => <StatusIcon task={t} />}
                variant="minimal"
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

TaskChecklist.displayName = 'TaskCheckList';

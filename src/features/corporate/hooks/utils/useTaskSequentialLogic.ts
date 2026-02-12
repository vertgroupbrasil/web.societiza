import { useMemo, useCallback, useState } from 'react';
import { Process, Tasks } from '@corporate/index';

export interface TaskSequenceLogic {
  canCompleteTask: (taskId: string) => boolean;
  canUnmarkTask: (taskId: string) => boolean;
  canToggleNotApplicable: (taskId: string) => boolean; // Nova função unificada
  canMarkNotApplicable: (taskId: string) => boolean;
  canUnmarkNotApplicable: (taskId: string) => boolean;
  getNextAvailableTask: () => string | null;
  getPreviousCompletedTask: () => string | null;
  isTaskBlocked: (taskId: string) => boolean;
  getBlockingTasks: (taskId: string) => string[];
  validateTaskCompletion: (taskId: string) => boolean;
  validateTaskUncompletion: (taskId: string) => boolean;
  findDependentTasks: (taskId: string) => Tasks[];
  isUserMarkedNA: (taskId: string) => boolean;
}

interface TaskState {
  id: string;
  userMarkedNA: boolean;
}

export const useTaskSequentialLogic = (
  process: Process,
  currentTasks?: Tasks[],
): TaskSequenceLogic => {
  const [userNAState] = useState<TaskState[]>([]);
  const activeTasks = currentTasks || process?.tarefas || [];

  const sequentialTaskOrder = useMemo(() => {
    if (!activeTasks || !Array.isArray(activeTasks)) return [];

    return [...activeTasks].sort((a, b) => {
      if (a.etapa.ordem !== b.etapa.ordem) return a.etapa.ordem - b.etapa.ordem;
      return a.sequencia - b.sequencia;
    });
  }, [activeTasks]);

  const findDependentTasks = useCallback(
    (taskId: string) => {
      const taskIndex = sequentialTaskOrder.findIndex((t) => t.id === taskId);
      return taskIndex === -1 ? [] : sequentialTaskOrder.slice(taskIndex + 1);
    },
    [sequentialTaskOrder],
  );

  const isUserMarkedNA = useCallback(
    (taskId: string) => {
      return userNAState.some((t) => t.id === taskId && t.userMarkedNA);
    },
    [userNAState],
  );

  const canUnmarkTask = useCallback(
    (taskId: string): boolean => {
      const task = activeTasks.find((t) => t.id === taskId);
      if (!task?.concluida) return false;

      const dependentTasks = findDependentTasks(taskId);
      return !dependentTasks.some((t) => t.concluida || t.nao_aplicavel);
    },
    [activeTasks, findDependentTasks],
  );

  const getNextAvailableTask = useCallback((): string | null => {
    for (const task of sequentialTaskOrder) {
      if (task.concluida || task.nao_aplicavel) continue;

      const taskIndex = sequentialTaskOrder.findIndex((t) => t.id === task.id);
      const previousTasks = sequentialTaskOrder.slice(0, taskIndex);

      const allPreviousCompleted = previousTasks.every((prevTask) => {
        if (prevTask.tarefa.obrigatoria) {
          return prevTask.concluida || prevTask.nao_aplicavel;
        }
        return true;
      });

      if (allPreviousCompleted) return task.id;
    }
    return null;
  }, [sequentialTaskOrder]);

  const canCompleteTask = useCallback(
    (id: string): boolean => {
      const task = activeTasks.find((t) => t.id === id);
      return (
        !!task &&
        !task.concluida &&
        !task.nao_aplicavel &&
        getNextAvailableTask() === id
      );
    },
    [activeTasks, getNextAvailableTask],
  );

  // 🔥 NOVA FUNÇÃO UNIFICADA PARA TOGGLE N/A
  const canToggleNotApplicable = useCallback(
    (id: string): boolean => {
      const task = activeTasks.find((t) => t.id === id);

      // Só tarefas não obrigatórias podem ser N/A
      if (!task || task.tarefa.obrigatoria) return false;

      // Se já está marcada como N/A, verifica se pode desmarcar
      if (task.nao_aplicavel) {
        const dependentTasks = findDependentTasks(id);
        return !dependentTasks.some((t) => t.concluida || t.nao_aplicavel);
      }

      // Se não está marcada, verifica se pode marcar (deve ser a próxima na sequência)
      return canCompleteTask(id);
    },
    [activeTasks, findDependentTasks, canCompleteTask],
  );

  // 🔄 FUNÇÃO CORRIGIDA - Agora permite marcar N/A se pode togglear
  const canMarkNotApplicable = useCallback(
    (taskId: string): boolean => {
      const task = activeTasks.find((t) => t.id === taskId);
      return (
        !!task &&
        !task.tarefa.obrigatoria &&
        !task.nao_aplicavel && // Só se não estiver marcada
        canCompleteTask(taskId)
      );
    },
    [activeTasks, canCompleteTask],
  );

  // 🔄 FUNÇÃO CORRIGIDA - Lógica específica para N/A
  const canUnmarkNotApplicable = useCallback(
    (taskId: string): boolean => {
      const task = activeTasks.find((t) => t.id === taskId);
      if (!task?.nao_aplicavel) return false;

      // Verifica se há tarefas dependentes que foram concluídas/marcadas como N/A
      const dependentTasks = findDependentTasks(taskId);
      return !dependentTasks.some((t) => t.concluida || t.nao_aplicavel);
    },
    [activeTasks, findDependentTasks],
  );

  const getPreviousCompletedTask = useCallback((): string | null => {
    for (let i = sequentialTaskOrder.length - 1; i >= 0; i--) {
      const task = sequentialTaskOrder[i];
      if (
        (task.concluida || task.nao_aplicavel) &&
        (canUnmarkTask(task.id) || canUnmarkNotApplicable(task.id))
      ) {
        return task.id;
      }
    }
    return null;
  }, [sequentialTaskOrder, canUnmarkTask, canUnmarkNotApplicable]);

  const isTaskBlocked = useCallback(
    (taskId: string): boolean => {
      return !canCompleteTask(taskId);
    },
    [canCompleteTask],
  );

  const getBlockingTasks = useCallback(
    (taskId: string): string[] => {
      const taskIndex = sequentialTaskOrder.findIndex((t) => t.id === taskId);
      return sequentialTaskOrder
        .slice(0, taskIndex)
        .filter(
          (prevTask) =>
            prevTask.tarefa.obrigatoria &&
            !prevTask.concluida &&
            !prevTask.nao_aplicavel,
        )
        .map((t) => t.id);
    },
    [sequentialTaskOrder],
  );

  return {
    canCompleteTask,
    canUnmarkTask,
    canToggleNotApplicable, // ✅ Nova função exportada
    canMarkNotApplicable,
    canUnmarkNotApplicable,
    getNextAvailableTask,
    getPreviousCompletedTask,
    isTaskBlocked,
    getBlockingTasks,
    validateTaskCompletion: canCompleteTask,
    validateTaskUncompletion: canUnmarkTask,
    findDependentTasks,
    isUserMarkedNA,
  };
};

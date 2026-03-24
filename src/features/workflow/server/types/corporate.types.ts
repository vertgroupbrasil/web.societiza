import { z } from 'zod';
import {
  processSchemaDTO,
  updateProcessSchemaDTO,
  processByStagesSchema,
  processSchema,
  processTypeSchema,
  processTypesSchema,
  tasksSchema,
  taskSchema,
  processByIdSchema,
} from '../../schemas/process.schema';
import { stageSchema, stagesSchema } from '../../schemas/stage.schema';
import { corporateFiltersSchema } from '../../schemas/utils.schema';

export type MutationContext = {
  previousData?: ProcessByStages | undefined; // Explicitamente opcional
  previousProcess?: ProcessById | undefined; // Explicitamente opcional
};

export interface TaskLogic {
  canCompleteTask: (taskId: string) => boolean;
  canMarkNotApplicable: (taskId: string) => boolean;
  isTaskBlocked: (taskId: string) => boolean;
  getBlockingTasks: (taskId: string) => string[];
  getNextAvailableTask: () => string | null;
  canUnmarkTask: (taskId: string) => boolean;
}

export type ProcessDTO = z.infer<typeof processSchemaDTO>;
export type UpdateProcessDTO = z.infer<typeof updateProcessSchemaDTO>;
export type ProcessByStages = z.infer<typeof processByStagesSchema>;
export type ProcessType = z.infer<typeof processTypeSchema>;
export type ProcessTypes = z.infer<typeof processTypesSchema>;
export type Process = z.infer<typeof processSchema>;
export type ProcessById = z.infer<typeof processByIdSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type Stages = z.infer<typeof stagesSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Tasks = z.infer<typeof tasksSchema>;
export type CorporateFilters = z.infer<typeof corporateFiltersSchema>;

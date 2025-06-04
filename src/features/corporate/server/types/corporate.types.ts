import { z } from 'zod';
import {
  processSchemaDTO,
  updateProcessSchemaDTO,
  processByStagesSchema,
  processesTypeSchema,
  processSchema,
} from '../../schemas/process.schema';
import { stageSchema, stagesSchema } from '../../schemas/stage.schema';

export type MutationContext = {
  previousData?: ProcessByStages | undefined; // Explicitamente opcional
};

export type ProcessDTO = z.infer<typeof processSchemaDTO>;
export type UpdateProcessDTO = z.infer<typeof updateProcessSchemaDTO>;
export type ProcessByStages = z.infer<typeof processByStagesSchema>;
export type Process = z.infer<typeof processSchema>;
export type Stage = z.infer<typeof stageSchema>;
export type Stages = z.infer<typeof stagesSchema>;

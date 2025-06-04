import { z } from '@flowtec/lib/zod-portuguese';

export const stageSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  ordem: z.coerce.number(),
});

export const stagesSchema = z.object({
  etapas: z.array(stageSchema),
});


import { z } from 'zod';

export const paginationSchema = z.object({
  count: z.coerce.number(),
  next: z.coerce.number().nullable(),
  previous: z.coerce.number().nullable(),
});

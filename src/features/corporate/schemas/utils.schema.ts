import { z } from '@flowtec/lib/zod-portuguese';

export const corporateFiltersSchema = z
  .object({
    searchTerm: z.string().optional(),
    processType: z.string().optional(),
    urgency: z.enum(['', 'normal', 'warning', 'urgent', 'critical']).optional(),
    accounting: z.string().optional(),
    dateRange: z
      .object({
        start: z.coerce.date().optional().nullable(),
        end: z.coerce.date().optional().nullable(),
      })
      .optional(),
  })
  .optional();

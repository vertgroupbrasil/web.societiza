import { formatCNPJ } from "@flowtec/lib/format";
import { z } from "zod";

export const Document = z
  .string({ required_error: 'CNPJ é obrigatório.' })
  .refine((doc) => /^\d{14}$/.test(doc.replace(/\D/g, '')), {
    message: 'CNPJ deve conter exatamente 14 dígitos numéricos.',
  })
  .transform((doc) => formatCNPJ(doc));

export type CNPJ = z.infer<typeof Document>; 
import { z } from 'zod'

export const addressSchema = z.object({
  rua: z.string().min(1, "Rua é obrigatória"),
  // ✅ CORREÇÃO: Aceitar 0 ou usar min(1) 
  numero: z.number().int().min(1, "Número deve ser maior que 0"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z.string()
    .regex(/^\d{5}-?\d{3}$/, "CEP deve ter 8 dígitos")
    .transform(val => val.replace(/-/g, '')),
  municipio: z.string().min(1, "Município é obrigatório"),
  complemento: z.string().optional(),
  uf: z.string()
    .length(2, "UF deve ter 2 caracteres")
    .toUpperCase()
})
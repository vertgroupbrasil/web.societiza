import { z } from "zod"

export const viacepSchema = z.object({
    cep: z.string(),
    logradouro: z.string(),
    complemento: z.string(),
    unidade: z.string(),
    bairro: z.string(),
    localidade: z.string(),
    uf: z.string(),
    estado: z.string(),
})
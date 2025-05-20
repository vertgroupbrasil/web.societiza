import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const emptyAuth = {
  email: '',
  password: '',
};

export type Auth = z.infer<typeof authSchema>;

import {
  z,
  customMessage,
  portugueseMessages,
} from '@flowtec/lib/zod-portuguese';

export const authSchema = z.object({
  email: z
    .string(customMessage(portugueseMessages.required))
    .email(customMessage(portugueseMessages.email)),
  password: z
    .string(customMessage(portugueseMessages.required))
    .min(8, customMessage(portugueseMessages.minLength(8))),
});

export const emptyAuth = {
  email: '',
  password: '',
};

export type Auth = z.infer<typeof authSchema>;

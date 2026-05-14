import {
  z,
  customMessage,
  portugueseMessages,
} from '@societiza/lib/zod-portuguese';

// ── Login ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string(customMessage(portugueseMessages.required))
    .email(customMessage(portugueseMessages.email)),
  password: z
    .string(customMessage(portugueseMessages.required))
    .min(8, customMessage(portugueseMessages.minLength(8))),
});

export const emptyLogin = {
  email: '',
  password: '',
};

/** @deprecated use loginSchema */
export const authSchema = loginSchema;
/** @deprecated use emptyLogin */
export const emptyAuth = emptyLogin;

export type Auth = z.infer<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// ── Login response (do backend) ───────────────────────────────────────────────

export const loginResponseSchema = z.object({
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// ── Forgot password ───────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z
    .string(customMessage(portugueseMessages.required))
    .email(customMessage(portugueseMessages.email)),
});

export const emptyForgotPassword = {
  email: '',
};

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ── Reset password ────────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z
      .string(customMessage(portugueseMessages.required))
      .min(8, customMessage(portugueseMessages.minLength(8))),
    confirmPassword: z
      .string(customMessage(portugueseMessages.required))
      .min(8, customMessage(portugueseMessages.minLength(8))),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

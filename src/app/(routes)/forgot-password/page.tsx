import { ForgotPasswordForm } from '@societiza/features/auth/components/forms/forgot-password-form';
import IconOrange from '@societiza/components/icon-orange';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Recuperar senha',
  description: 'Recupere o acesso à sua conta Societiza.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-screen flex justify-center">
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconOrange />
            <div className="text-center">
              <h1 className="text-2xl font-bold">Recuperar acesso</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            </div>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

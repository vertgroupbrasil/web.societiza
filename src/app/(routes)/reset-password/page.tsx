import { ResetPasswordForm } from '@societiza/features/auth/components/forms/reset-password-form';
import IconOrange from '@societiza/components/icon-orange';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Redefinir senha',
  description: 'Crie uma nova senha para sua conta Societiza.',
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const normalizedToken = token?.replaceAll(' ', '+');

  // Token ausente → redireciona para forgot password
  if (!normalizedToken) {
    redirect('/forgot-password');
  }

  return (
    <div className="min-h-screen w-screen flex justify-center">
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconOrange />
            <div className="text-center">
              <h1 className="text-2xl font-bold">Redefinir senha</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Crie uma nova senha para sua conta. Mínimo de 8 caracteres.
              </p>
            </div>
          </div>
          <ResetPasswordForm token={normalizedToken} />
        </div>
      </div>
    </div>
  );
}

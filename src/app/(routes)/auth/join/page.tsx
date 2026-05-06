import IconOrange from '@societiza/components/icon-orange';
import { InvitationRegisterForm } from '@societiza/features/identity-invitations/components/InvitationRegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Cadastro por convite',
  description: 'Crie sua conta Societiza a partir do link de convite.',
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function InvitationJoinPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const normalizedToken = token?.replaceAll(' ', '+');

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--background) 0%, var(--background) 52%, rgba(255,255,255,0) 100%), radial-gradient(ellipse at 50% 120%, var(--primary) 0%, var(--background) 80%)',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconOrange />
            <div className="text-center">
              <h1 className="text-2xl font-bold">Criar conta</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete seu cadastro para acessar a Societiza.
              </p>
            </div>
          </div>

          <InvitationRegisterForm token={normalizedToken} />
        </div>
      </div>
    </div>
  );
}

import { LoginForm } from '@societiza/features/auth/components/forms/login-form';
import IconOrange from '@societiza/components/icon-orange';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Iniciar sessão',
  description: 'O futuro contábil em uma plataforma só.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-screen flex justify-center items-center overflow-hidden">
      {/* ── Fundo gradiente ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--background) 0%, var(--background) 50%, rgba(255,255,255,0) 100%), radial-gradient(ellipse at 50% 120%, var(--primary) 0%, var(--background) 80%)',
          opacity: 0.4,
        }}
      >
        <div
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 70%)',
            backgroundImage:
              'repeating-conic-gradient(from 0deg at 50% 100%, var(--primary) 0deg, var(--primary) 2deg, transparent 2deg, transparent 10deg)',
            bottom: '-20%',
            height: '100%',
            left: '50%',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
            opacity: 0.7,
            pointerEvents: 'none',
            position: 'absolute',
            transform: 'translateX(-50%)',
            width: '200%',
          }}
        />
      </div>

      {/* ── Conteúdo ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center p-8 w-full">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconOrange />
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Bem vindo de volta!
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Esqueça as milhares de planilhas e se concentre em uma
                plataforma só.
              </p>
            </div>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            Não possui conta?{' '}
            <Link
              href="/cadastro"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

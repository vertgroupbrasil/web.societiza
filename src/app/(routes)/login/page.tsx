import { LoginForm } from '@societiza/features/auth/components/forms/login-form';
import LogoOrange from '@societiza/components/logo-orange';
import { LoginFeaturePanel } from './_components/login-feature-panel';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Societiza - Iniciar sessão',
  description: 'O futuro contábil em uma plataforma só.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex">
      {/* ── Lado esquerdo — formulário ──────────────────────────────────── */}
      <div className="flex flex-col justify-between w-full lg:w-[480px] xl:w-[520px] shrink-0 px-8 py-10 lg:px-12">
        {/* Logo */}
        <div>
          <LogoOrange />
        </div>

        {/* Form area — centralizada verticalmente */}
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com sua conta para continuar no Societiza.
            </p>
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

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Societiza. Todos os direitos reservados.
        </p>
      </div>

      {/* ── Lado direito — feature showcase ────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <LoginFeaturePanel />
      </div>
    </div>
  );
}

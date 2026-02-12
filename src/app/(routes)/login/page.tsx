import { LoginForm } from '@flowtec/features/auth/components/forms/login-form';
import Image from 'next/image';
import Icon from '@flowtec/components/icon';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex justify-center">
      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Icon />
            <div className=" text-center ">
              <h1 className="text-2xl font-bold">
                Iniciar sessão no meu societário
              </h1>
              <p>
                Esqueça as milhares de planilhas e se concentre em uma
                plataforma só.
              </p>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

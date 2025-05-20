import { LoginForm } from '@flowtec/features/auth/components/forms/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

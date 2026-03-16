'use client';
import { Button } from '@societiza/components/ui/shadcnui';
import { useAuthMutations } from '../../hooks/mutations/useAuthMutations';
import { LogoutIcon } from '@societiza/components/ui/icons/logout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const { logout } = useAuthMutations();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout;
      router.push('/login');
      toast.success('Saindo da sua conta...');
    } catch (err) {
      toast.error('Houve algum erro ao sair da sua conta...');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="flex items-center gap-2 justify-center w-full"
      loading={logout.isPending}
    >
      <LogoutIcon />
      Sair
    </Button>
  );
}

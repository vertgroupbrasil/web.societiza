'use client';

import { Button } from '@societiza/components/ui/shadcnui';
import { useLogout } from '../../hooks/mutations/useAuthMutations';
import { LogoutIcon } from '@societiza/components/ui/icons/logout';

export default function Logout() {
  const logout = useLogout();

  return (
    <Button
      variant="outline"
      onClick={() => logout.mutate()}
      className="flex items-center gap-2 justify-center w-full"
      loading={logout.isPending}
      disabled={logout.isPending}
    >
      <LogoutIcon />
      Sair
    </Button>
  );
}

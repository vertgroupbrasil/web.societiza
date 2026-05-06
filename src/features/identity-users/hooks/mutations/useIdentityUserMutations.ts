'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { identityUserService } from '../../server/services/identity-user.service';
import { identityUserQueryKeys } from '../queries/useIdentityUserQueries';
import type { UpdateProfilePayload } from '../../schemas/identity-user.schema';

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      identityUserService.updateMyProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: identityUserQueryKeys.profile(),
      });
      toast.success('Perfil atualizado com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    },
  });
};

export const usePromoteAccountancyMember = (accountancyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      identityUserService.promoteAccountancyMember(accountancyId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: identityUserQueryKeys.all,
      });
      toast.success('Membro promovido a administrador.');
    },
    onError: () => {
      toast.error('Erro ao promover membro. Tente novamente.');
    },
  });
};

export const useDeleteIdentityUser = (accountancyId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      identityUserService.deleteUser(userId, accountancyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: identityUserQueryKeys.all,
      });
      toast.success('Acesso removido com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao remover acesso. Tente novamente.');
    },
  });
};

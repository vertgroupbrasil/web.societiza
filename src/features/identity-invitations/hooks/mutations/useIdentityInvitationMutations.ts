'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { identityInvitationService } from '../../server/services/identity-invitation.service';
import { identityInvitationQueryKeys } from '../queries/useIdentityInvitationQueries';
import type {
  CreateInvitationLinkPayload,
  RegisterInvitationUserPayload,
} from '../../schemas/identity-invitation.schema';

export const useCreateInvitationLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationLinkPayload) =>
      identityInvitationService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: identityInvitationQueryKeys.lists(),
      });
      toast.success('Link de convite gerado.');
    },
    onError: (error: unknown) => {
      const status =
        (error as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        toast.error('Já existe um link ativo para este convite.');
        return;
      }
      toast.error('Não foi possível gerar o link de convite.');
    },
  });
};

export const useRegisterInvitationUser = () =>
  useMutation({
    mutationFn: (payload: RegisterInvitationUserPayload) =>
      identityInvitationService.register(payload),
    onSuccess: () => {
      toast.success('Cadastro concluído com sucesso.');
    },
    onError: (error: unknown) => {
      const status =
        (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        toast.error('Link de convite inválido ou expirado.');
        return;
      }
      if (status === 409) {
        toast.error('Este e-mail já está cadastrado.');
        return;
      }
      toast.error('Não foi possível concluir o cadastro.');
    },
  });

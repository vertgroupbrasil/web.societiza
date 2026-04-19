import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { officeService } from '../../server/services/office.service';
import { officeQueryKeys } from '../queries/query-options';
import type {
  UpdateOfficeInput,
  CreateOfficeInput,
  InviteByEmailInput,
  TransferOwnershipInput,
} from '../../schemas/office.schema';

export const useUpdateOffice = (officeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateOfficeInput) =>
      officeService.update(officeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: officeQueryKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: officeQueryKeys.detail(officeId),
      });
      toast.success('Escritório atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar escritório. Tente novamente.');
    },
  });
};

export const useCreateOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOfficeInput) => officeService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: officeQueryKeys.lists() });
      toast.success('Escritório criado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar escritório. Tente novamente.');
    },
  });
};

export const useDeleteOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (officeId: string) => officeService.delete(officeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: officeQueryKeys.lists() });
      toast.success('Escritório excluído com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao excluir escritório. Tente novamente.');
    },
  });
};

export const useSetActiveOffice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (officeId: string) => officeService.setActive(officeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: officeQueryKeys.all });
      // Sem toast — troca de escritório deve ser silenciosa e instantânea
    },
    onError: () => {
      toast.error('Erro ao trocar escritório. Tente novamente.');
    },
  });
};

export const useRemoveMember = (officeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) =>
      officeService.removeMember(officeId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: officeQueryKeys.members(officeId),
      });
      toast.success('Membro removido do escritório.');
    },
    onError: () => {
      toast.error('Erro ao remover membro. Tente novamente.');
    },
  });
};

export const useInviteByEmail = (officeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteByEmailInput) =>
      officeService.inviteByEmail(officeId, data),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: officeQueryKeys.members(officeId),
      });
      toast.success(`Convite enviado para ${variables.email}!`);
    },
    onError: () => {
      toast.error('Erro ao enviar convite. Tente novamente.');
    },
  });
};

export const useTransferOwnership = (officeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TransferOwnershipInput) =>
      officeService.transferOwnership(officeId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: officeQueryKeys.members(officeId),
      });
      void queryClient.invalidateQueries({ queryKey: officeQueryKeys.lists() });
      toast.success('Ownership transferida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao transferir ownership. Tente novamente.');
    },
  });
};

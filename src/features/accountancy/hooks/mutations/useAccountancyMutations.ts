import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountancyService } from '../../server/services/accountancy.service';
import type { CreateAccountancyInput } from '../../schemas/accountancy.schema';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import { refreshVisibleAndMarkStale } from '@societiza/lib/query-refresh';

const LIST_KEY = [API_ENDPOINTS.accountancy.getAll];

export const useCreateAccountancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountancyInput) =>
      accountancyService.create(data),
    onSuccess: async () => {
      await refreshVisibleAndMarkStale(queryClient, [LIST_KEY]);
      toast.success('Contabilidade criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar contabilidade');
    },
  });
};

export const useUpdateAccountancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAccountancyInput }) =>
      accountancyService.update(id, data),
    onSuccess: async (_data, variables) => {
      await refreshVisibleAndMarkStale(queryClient, [
        LIST_KEY,
        [...LIST_KEY, variables.id],
      ]);
      toast.success('Contabilidade atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar contabilidade');
    },
  });
};

export const useDeleteAccountancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountancyService.delete(id),
    onSuccess: async () => {
      await refreshVisibleAndMarkStale(queryClient, [LIST_KEY]);
      toast.success('Contabilidade removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover contabilidade');
    },
  });
};

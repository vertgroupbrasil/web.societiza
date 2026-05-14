import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountancyService } from '../../server/services/accountancy.service';
import type { AccountancyPayload } from '../../schemas/accountancy.schema';
import { accountancyQueryKeys } from '../queries/useAccountancyQueries';

export const useCreateAccountancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AccountancyPayload) =>
      accountancyService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: accountancyQueryKeys.lists(),
      });
      toast.success('Contabilidade criada com sucesso');
    },
    onError: (error: unknown) => {
      const status =
        (error as { response?: { status?: number } })?.response?.status;
      // 409 cai como erro de campo no formulário (handled lá);
      // toast só é exibido aqui para falhas inesperadas
      if (status !== 409 && status !== 400) {
        toast.error('Erro ao criar contabilidade');
      }
    },
  });
};

export const useUpdateAccountancy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AccountancyPayload;
    }) => accountancyService.update(id, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: accountancyQueryKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: accountancyQueryKeys.detail(variables.id),
      });
      toast.success('Contabilidade atualizada com sucesso');
    },
    onError: (error: unknown) => {
      const status =
        (error as { response?: { status?: number } })?.response?.status;
      if (status !== 409 && status !== 400) {
        toast.error('Erro ao atualizar contabilidade');
      }
    },
  });
};

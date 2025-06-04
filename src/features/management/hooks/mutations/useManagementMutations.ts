'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import { create, _delete } from '../../server/services/management.service';

const api = API_ENDPOINTS;

export function useManagementMutations() {
  const qc = useQueryClient();

  const createAccounting = useMutation({
    mutationFn: create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [api.accountings.createContabilidade] }),
  });

  const deleteAccounting = useMutation({
    mutationFn: _delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [api.accountings.deleteContabilidade] }),
  });

  return { createAccounting, deleteAccounting };
}

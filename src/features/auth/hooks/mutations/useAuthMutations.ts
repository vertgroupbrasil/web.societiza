'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  login as Auth,
  logout as UnAuth,
  refresh as RefreshToken,
} from '@societiza/features/auth/server/services/auth.service';
import { API_ENDPOINTS } from '@societiza/routes/endpoints';

const api = API_ENDPOINTS;

export function useAuthMutations() {
  const qc = useQueryClient();

  const login = useMutation({
    mutationFn: Auth,
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.auth.login] }),
  });

  const logout = useMutation({
    mutationFn: UnAuth,
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.auth.logout] }),
  });

  const refresh = useMutation({
    mutationFn: RefreshToken,
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.auth.refresh] }),
  });

  return { login, logout, refresh };
}

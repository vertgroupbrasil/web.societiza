import { queryOptions } from '@tanstack/react-query';
import { officeService } from '../../server/services/office.service';

export const officeQueryKeys = {
  all: ['offices'] as const,
  mine: () => [...officeQueryKeys.all, 'mine'] as const,
  lists: () => [...officeQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...officeQueryKeys.all, 'detail', id] as const,
  members: (officeId: string) =>
    [...officeQueryKeys.all, officeId, 'members'] as const,
  inviteLink: (officeId: string) =>
    [...officeQueryKeys.all, officeId, 'invite-link'] as const,
};

export const officeQueryOptions = {
  mine: () =>
    queryOptions({
      queryKey: officeQueryKeys.mine(),
      queryFn: () => officeService.getMine(),
      staleTime: 1000 * 60 * 5,
      retry: 1,
    }),

  list: () =>
    queryOptions({
      queryKey: officeQueryKeys.lists(),
      queryFn: () => officeService.getAll(),
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: officeQueryKeys.detail(id),
      queryFn: () => officeService.getById(id),
      staleTime: 1000 * 60 * 5,
      enabled: !!id,
    }),

  members: (officeId: string) =>
    queryOptions({
      queryKey: officeQueryKeys.members(officeId),
      queryFn: () => officeService.getMembers(officeId),
      staleTime: 1000 * 60 * 2,
      enabled: !!officeId,
    }),

  inviteLink: (officeId: string) =>
    queryOptions({
      queryKey: officeQueryKeys.inviteLink(officeId),
      queryFn: () => officeService.getInviteLink(officeId),
      staleTime: Infinity, // link de convite não expira
      enabled: !!officeId,
    }),
};

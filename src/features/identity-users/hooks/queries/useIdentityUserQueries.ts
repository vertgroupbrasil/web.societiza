import { useQuery } from '@tanstack/react-query';
import { identityUserService } from '../../server/services/identity-user.service';

export const identityUserQueryKeys = {
  all: ['identity-users'] as const,
  profile: () => [...identityUserQueryKeys.all, 'profile'] as const,
  systemAdmins: (onlyActive: boolean, pageNumber: number, pageSize: number) =>
    [
      ...identityUserQueryKeys.all,
      'system-admins',
      { onlyActive, pageNumber, pageSize },
    ] as const,
  accountancyMembers: (
    accountancyId: string,
    onlyActive: boolean,
    pageNumber: number,
    pageSize: number,
  ) =>
    [
      ...identityUserQueryKeys.all,
      'accountancy-members',
      accountancyId,
      { onlyActive, pageNumber, pageSize },
    ] as const,
};

export const useMyProfile = (enabled = true) =>
  useQuery({
    queryKey: identityUserQueryKeys.profile(),
    queryFn: () => identityUserService.getMyProfile(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });

export const useSystemAdmins = (
  onlyActive = true,
  pageNumber = 1,
  pageSize = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: identityUserQueryKeys.systemAdmins(
      onlyActive,
      pageNumber,
      pageSize,
    ),
    queryFn: () =>
      identityUserService.listSystemAdmins(onlyActive, pageNumber, pageSize),
    enabled,
    placeholderData: (previous) => previous,
  });

export const useAccountancyMembers = (
  accountancyId: string | undefined,
  onlyActive = true,
  pageNumber = 1,
  pageSize = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: identityUserQueryKeys.accountancyMembers(
      accountancyId ?? '',
      onlyActive,
      pageNumber,
      pageSize,
    ),
    queryFn: () =>
      identityUserService.listAccountancyMembers(
        accountancyId as string,
        onlyActive,
        pageNumber,
        pageSize,
      ),
    enabled: enabled && !!accountancyId,
    placeholderData: (previous) => previous,
  });

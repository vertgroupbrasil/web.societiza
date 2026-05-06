import { useQuery } from '@tanstack/react-query';
import { identityInvitationService } from '../../server/services/identity-invitation.service';

export const identityInvitationQueryKeys = {
  all: ['identity-invitations'] as const,
  lists: () => [...identityInvitationQueryKeys.all, 'list'] as const,
  list: (
    onlyActive: boolean,
    accountancyId: string | undefined,
    pageNumber: number,
    pageSize: number,
  ) =>
    [
      ...identityInvitationQueryKeys.lists(),
      { onlyActive, accountancyId, pageNumber, pageSize },
    ] as const,
  detail: (invitationLinkId: string) =>
    [...identityInvitationQueryKeys.all, 'detail', invitationLinkId] as const,
};

export const useInvitationLinks = (
  onlyActive = true,
  accountancyId?: string,
  pageNumber = 1,
  pageSize = 10,
  enabled = true,
) =>
  useQuery({
    queryKey: identityInvitationQueryKeys.list(
      onlyActive,
      accountancyId,
      pageNumber,
      pageSize,
    ),
    queryFn: () =>
      identityInvitationService.list(
        onlyActive,
        accountancyId,
        pageNumber,
        pageSize,
      ),
    enabled,
    placeholderData: (previous) => previous,
  });

export const useInvitationLinkById = (
  invitationLinkId: string | undefined,
  enabled = true,
) =>
  useQuery({
    queryKey: invitationLinkId
      ? identityInvitationQueryKeys.detail(invitationLinkId)
      : identityInvitationQueryKeys.all,
    queryFn: () => identityInvitationService.getById(invitationLinkId as string),
    enabled: enabled && !!invitationLinkId,
  });

import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import {
  createInvitationLinkResponseSchema,
  identifierResponseSchema,
  invitationLinkByIdSchema,
  pagedInvitationLinksSchema,
  type CreateInvitationLinkPayload,
  type CreateInvitationLinkResponse,
  type IdentifierResponse,
  type InvitationLinkById,
  type PagedInvitationLinks,
  type RegisterInvitationUserPayload,
} from '../../schemas/identity-invitation.schema';

const api = API_ENDPOINTS.identityInvitations;

export const identityInvitationService = {
  create: async (
    payload: CreateInvitationLinkPayload,
  ): Promise<CreateInvitationLinkResponse> => {
    const response = await fetcher.post(api.create, payload);
    return createInvitationLinkResponseSchema.parse(response.data);
  },

  list: async (
    onlyActive = true,
    accountancyId?: string,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedInvitationLinks> => {
    const response = await fetcher.get(
      api.list(onlyActive, accountancyId, pageNumber, pageSize),
    );
    return pagedInvitationLinksSchema.parse(response.data);
  },

  getById: async (invitationLinkId: string): Promise<InvitationLinkById> => {
    const response = await fetcher.get(api.detail(invitationLinkId));
    return invitationLinkByIdSchema.parse(response.data);
  },

  register: async (
    payload: RegisterInvitationUserPayload,
  ): Promise<IdentifierResponse> => {
    const response = await fetcher.post(api.register, payload);
    return identifierResponseSchema.parse(response.data);
  },
};

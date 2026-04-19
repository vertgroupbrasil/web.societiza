// TODO: remover mock imports quando backend entregar os endpoints de /offices
import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import {
  officeSchema,
  officesSchema,
  membersSchema,
  inviteLinkSchema,
  type Office,
  type Offices,
  type Members,
  type InviteLink,
  type UpdateOfficeInput,
  type CreateOfficeInput,
  type InviteByEmailInput,
  type TransferOwnershipInput,
} from '../../schemas/office.schema';
import {
  MOCK_OFFICES,
  MOCK_ACTIVE_OFFICE_ID,
  getMockMembersByOfficeId,
  MOCK_INVITE_LINK,
} from '../../_mock';

const api = API_ENDPOINTS.offices;

// Flag para usar mock (visual-first) ou API real
const USE_MOCK = true; // TODO: remover quando backend entregar

export type CreateEntityResponse = { id: string };

export const officeService = {
  getAll: async (): Promise<Offices> => {
    if (USE_MOCK) return MOCK_OFFICES;
    const response = await fetcher.get(api.getAll);
    return officesSchema.parse(response.data);
  },

  getById: async (id: string): Promise<Office> => {
    if (USE_MOCK) {
      const office = MOCK_OFFICES.find((o) => o.id === id);
      if (!office) throw new Error('Escritório não encontrado');
      return office;
    }
    const response = await fetcher.get(api.getById(id));
    return officeSchema.parse(response.data);
  },

  getActiveOfficeId: (): string => {
    if (USE_MOCK) return MOCK_ACTIVE_OFFICE_ID;
    return '';
  },

  create: async (data: CreateOfficeInput): Promise<CreateEntityResponse> => {
    if (USE_MOCK) return { id: `office-mock-${Date.now()}` };
    const response = await fetcher.post(api.create, data);
    return response.data as CreateEntityResponse;
  },

  update: async (id: string, data: UpdateOfficeInput): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.put(api.update(id), data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.delete(api.delete(id));
  },

  setActive: async (officeId: string): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.put(api.setActive, { officeId });
  },

  getMembers: async (officeId: string): Promise<Members> => {
    if (USE_MOCK) return getMockMembersByOfficeId(officeId);
    const response = await fetcher.get(api.members(officeId));
    return membersSchema.parse(response.data);
  },

  removeMember: async (officeId: string, memberId: string): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.delete(api.removeMember(officeId, memberId));
  },

  inviteByEmail: async (
    officeId: string,
    data: InviteByEmailInput,
  ): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.post(api.inviteByEmail(officeId), data);
  },

  getInviteLink: async (officeId: string): Promise<InviteLink> => {
    if (USE_MOCK) return MOCK_INVITE_LINK;
    const response = await fetcher.post(api.inviteLink(officeId), {});
    return inviteLinkSchema.parse(response.data);
  },

  transferOwnership: async (
    officeId: string,
    data: TransferOwnershipInput,
  ): Promise<void> => {
    if (USE_MOCK) return;
    await fetcher.put(api.transferOwnership(officeId), data);
  },
};

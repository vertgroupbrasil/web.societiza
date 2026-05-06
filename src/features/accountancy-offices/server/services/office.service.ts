// O backend de "offices" multi-org ainda não existe. A spec accountancy-org
// trata UMA contabilidade como UM escritório do usuário; usamos /accountancy/me
// como fonte real para os dados do escritório ativo do usuário.
// Demais operações (membros, convites, plano, transferência, criação de novo
// escritório) permanecem mockadas — pertencem a specs vizinhas em backlog.
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
import {
  accountancyDetailSchema,
  type AccountancyDetail,
} from '@societiza/features/accountancy/schemas/accountancy.schema';

const api = API_ENDPOINTS.offices;

// Operações ainda sem backend (membros, convites, plano, criar escritório etc.)
const USE_MOCK_FOR_UNAVAILABLE_BACKEND = true;

export type CreateEntityResponse = { id: string };

const mapAccountancyToOffice = (a: AccountancyDetail): Office => ({
  id: a.id,
  cnpj: a.cnpj,
  legalName: a.legalName,
  tradeName: a.tradeName,
  address: a.address,
  city: a.city,
  state: a.state,
  postalCode: a.postalCode,
  phone: a.phone,
  email: a.email,
  // Campos sem backend nesta spec — preenchidos com defaults seguros
  description: null,
  profilePhotoUrl: null,
  bannerUrl: null,
  plan: 'Free',
  status: 'Active',
  processCount: 0,
  memberCount: 0,
  isOwner: false,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt ?? a.createdAt,
});

const fetchMyOffice = async (): Promise<Office> => {
  const response = await fetcher.get(API_ENDPOINTS.accountancy.getMe);
  const accountancy = accountancyDetailSchema.parse(response.data);
  return mapAccountancyToOffice(accountancy);
};

export const officeService = {
  getAll: async (): Promise<Offices> => {
    // Usuário possui exatamente um escritório (a contabilidade dele).
    const mine = await fetchMyOffice();
    return officesSchema.parse([mine]);
  },

  getById: async (id: string): Promise<Office> => {
    const mine = await fetchMyOffice();
    if (mine.id !== id) {
      throw new Error('Escritório não encontrado');
    }
    return officeSchema.parse(mine);
  },

  getMine: fetchMyOffice,

  getActiveOfficeId: (): string => {
    // Mantido para compatibilidade — preferir consumir /me direto via getMine().
    return MOCK_ACTIVE_OFFICE_ID;
  },

  // Criação de novo escritório fica oculta na UI (single-org). Mantida por
  // compatibilidade tipada caso algum caller chame por engano.
  create: async (_data: CreateOfficeInput): Promise<CreateEntityResponse> => {
    throw new Error(
      'Criação de novo escritório indisponível: usuário possui apenas uma contabilidade.',
    );
  },

  // AccountancyAdmin/Employee não pode editar dados cadastrais (spec accountancy-org).
  // Backend rejeita com 403 caso o request chegue lá.
  update: async (id: string, data: UpdateOfficeInput): Promise<void> => {
    await fetcher.put(api.update(id), data);
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return;
    await fetcher.delete(api.delete(id));
  },

  setActive: async (officeId: string): Promise<void> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return;
    await fetcher.put(api.setActive, { officeId });
  },

  getMembers: async (officeId: string): Promise<Members> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND)
      return getMockMembersByOfficeId(officeId);
    const response = await fetcher.get(api.members(officeId));
    return membersSchema.parse(response.data);
  },

  removeMember: async (officeId: string, memberId: string): Promise<void> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return;
    await fetcher.delete(api.removeMember(officeId, memberId));
  },

  inviteByEmail: async (
    officeId: string,
    data: InviteByEmailInput,
  ): Promise<void> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return;
    await fetcher.post(api.inviteByEmail(officeId), data);
  },

  getInviteLink: async (officeId: string): Promise<InviteLink> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return MOCK_INVITE_LINK;
    const response = await fetcher.post(api.inviteLink(officeId), {});
    return inviteLinkSchema.parse(response.data);
  },

  transferOwnership: async (
    officeId: string,
    data: TransferOwnershipInput,
  ): Promise<void> => {
    if (USE_MOCK_FOR_UNAVAILABLE_BACKEND) return;
    await fetcher.put(api.transferOwnership(officeId), data);
  },
};

// Mantido para que callers que ainda referenciem MOCK_OFFICES não quebrem.
export const __MOCK_OFFICES = MOCK_OFFICES;

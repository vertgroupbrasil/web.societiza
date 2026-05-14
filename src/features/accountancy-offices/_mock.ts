// TODO: remover quando os endpoints de /offices estiverem disponíveis no backend
// Todos os handlers abaixo são mocks MSW para desenvolvimento visual-first.

import type { Office, Member, InviteLink } from './schemas/office.schema';

// ---- Dados realistas de mock ----

export const MOCK_MEMBERS_ESCRITORIO_1: Member[] = [
  {
    id: 'member-001',
    name: 'Carlos Henrique Lima',
    email: 'carlos@contabil-lima.com.br',
    role: 'Owner',
    avatarUrl: null,
    joinedAt: new Date('2025-01-10'),
  },
  {
    id: 'member-002',
    name: 'Ana Paula Ferreira',
    email: 'ana@contabil-lima.com.br',
    role: 'Member',
    avatarUrl: null,
    joinedAt: new Date('2025-03-22'),
  },
  {
    id: 'member-003',
    name: 'Roberto Souza',
    email: 'roberto@contabil-lima.com.br',
    role: 'Member',
    avatarUrl: null,
    joinedAt: new Date('2025-06-01'),
  },
];

export const MOCK_MEMBERS_ESCRITORIO_2: Member[] = [
  {
    id: 'member-010',
    name: 'Carlos Henrique Lima',
    email: 'carlos@contabil-lima.com.br',
    role: 'Owner',
    avatarUrl: null,
    joinedAt: new Date('2026-01-05'),
  },
];

export const MOCK_OFFICES: Office[] = [
  {
    id: 'office-001',
    cnpj: '12.345.678/0001-99',
    legalName: 'Contábil Lima e Associados LTDA',
    tradeName: 'Contábil Lima',
    address: 'Rua das Flores, 456, Sala 302',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01310-100',
    phone: '(11) 3344-5566',
    email: 'contato@contabil-lima.com.br',
    description:
      'Contabilidade consultiva para empresas em crescimento, com foco em organização fiscal, processos recorrentes e decisões mais claras.',
    profilePhotoUrl: null,
    bannerUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop',
    plan: 'Escrivaninha',
    status: 'Active',
    processCount: 12,
    memberCount: 3,
    isOwner: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 'office-002',
    cnpj: '98.765.432/0001-11',
    legalName: 'Escritório Auxiliar de Contabilidade ME',
    tradeName: null,
    address: 'Av. Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
    postalCode: '01311-000',
    phone: '(11) 9 8765-4321',
    email: null,
    description:
      'Escritório auxiliar para rotinas contábeis, organização de documentos e acompanhamento de processos internos.',
    profilePhotoUrl: null,
    bannerUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    plan: 'Free',
    status: 'Frozen',
    processCount: 5,
    memberCount: 1,
    isOwner: true,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-04-01'),
  },
];

export const MOCK_INVITE_LINK: InviteLink = {
  token: 'inv_abc123xyz789',
  url: 'https://app.societiza.com.br/convite/inv_abc123xyz789',
  officeId: 'office-001',
  createdAt: new Date('2026-04-10'),
};

// Estado local simulado — escritório ativo
export const MOCK_ACTIVE_OFFICE_ID = 'office-001';

// ---- Helpers de mock ----

export function getMockOfficeById(id: string): Office | undefined {
  return MOCK_OFFICES.find((o) => o.id === id);
}

export function getMockMembersByOfficeId(officeId: string): Member[] {
  if (officeId === 'office-001') return MOCK_MEMBERS_ESCRITORIO_1;
  if (officeId === 'office-002') return MOCK_MEMBERS_ESCRITORIO_2;
  return [];
}

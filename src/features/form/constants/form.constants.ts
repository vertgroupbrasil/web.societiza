import {} from '../lib/schemas';
import { z } from 'zod';
import {
  CorporateFormData,
  _companyData,
  _partners,
  CompanyDataForm,
  PartnersDataForm,
  ReviewDataForm,
} from '@form/index';

export interface FormStepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  schema: z.ZodSchema;
  dataKey: keyof CorporateFormData | null;
  dependencies?: string[];
  path: string;
}

export const FORM_STEPS: FormStepConfig[] = [
  {
    id: 'company-data',
    title: 'Dados da Empresa',
    description: 'Informações básicas e endereço da empresa',
    component: CompanyDataForm,
    schema: _companyData,
    dataKey: 'companyData', // ✅ TypeScript agora reconhece como chave válida
    path: '1',
  },
  {
    id: 'partners-data',
    title: 'Dados dos Sócios',
    description: 'Informações dos sócios e administradores',
    component: PartnersDataForm,
    schema: _partners.omit({ empresa_id: true }),
    dataKey: 'partnersData', // ✅ TypeScript agora reconhece como chave válida
    dependencies: ['company-data'],
    path: '2',
  },
  {
    id: 'review',
    title: 'Revisão Final',
    description: 'Confirme todos os dados antes de enviar',
    component: ReviewDataForm,
    schema: z.object({}),
    dataKey: null,
    dependencies: ['company-data', 'partners-data'],
    path: '3',
  },
];

export const getStepById = (id: string) =>
  FORM_STEPS.find((step) => step.id === id);

export const getStepByIndex = (index: number) => FORM_STEPS[index];

export const getTotalSteps = () => FORM_STEPS.length;

export const getProgressPercentage = (currentStep: number) =>
  ((currentStep + 1) / getTotalSteps()) * 100;

export const UFs = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;
export type UF = (typeof UFs)[number];

interface IssuingAgency {
  code: string;
  name: string;
  states: UF[];
}

export const issuingAgencies: IssuingAgency[] = [
  {
    code: 'SSP',
    name: 'Secretaria de Segurança Pública',
    states: [...UFs],
  },
  {
    code: 'PC',
    name: 'Polícia Civil',
    states: [...UFs],
  },
  {
    code: 'DETRAN',
    name: 'Departamento Estadual de Trânsito',
    states: [...UFs],
  },
  {
    code: 'CBM',
    name: 'Corpo de Bombeiros Militar',
    states: [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'ES',
      'GO',
      'MA',
      'MT',
      'MS',
      'MG',
      'PA',
      'PB',
      'PR',
      'PE',
      'PI',
      'RJ',
      'RN',
      'RS',
      'RO',
      'RR',
      'SC',
      'SP',
      'SE',
      'TO',
    ],
  },
  {
    code: 'PF',
    name: 'Polícia Federal',
    states: [...UFs],
  },
  {
    code: 'IFP',
    name: 'Instituto de Identificação Ricardo Gumbleton Daunt',
    states: ['SP'],
  },
  {
    code: 'IEP',
    name: 'Instituto de Identificação Félix Pacheco',
    states: ['MG'],
  },
];

export const REQUIRED_FIELDS = [
  { field: 'nome_fantasia', label: 'Nome Fantasia' },
  { field: 'email', label: 'Email' },
  { field: 'telefone', label: 'Telefone' },
  { field: 'endereco.rua', label: 'Rua' },
  { field: 'endereco.numero', label: 'Número' },
  { field: 'endereco.bairro', label: 'Bairro' },
  { field: 'endereco.cep', label: 'CEP' },
  { field: 'endereco.municipio', label: 'Município' },
  { field: 'endereco.uf', label: 'UF' },
  { field: 'inscricao_imob', label: 'Inscrição Imobiliária' },
  { field: 'val_capital_social', label: 'Capital Social' },
  { field: 'area_empresa', label: 'Área da Empresa' },
] as const;
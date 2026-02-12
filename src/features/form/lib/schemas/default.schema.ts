import { z } from 'zod';
import { CompanyData, infoAdicionaisSchema, addressSchema, Socio } from '@form/index';

const defaultAddress: z.infer<typeof addressSchema> = {
  rua: '',
  numero: 1, // ✅ CORREÇÃO: 1 em vez de 0 (deve ser positivo)
  bairro: '',
  cep: '',
  municipio: '',
  complemento: '',
  uf: '',
};

const defaultInfoAdicionais: z.infer<typeof infoAdicionaisSchema> = {
  resp_tecnica: false,
  // ✅ CORREÇÃO: Remover undefined explícito
};

export const defaultCompanyData: CompanyData = {
  processo_id: '',
  opcoes_nome_empresa: ['', '', ''],
  nome_fantasia: '',
  endereco: defaultAddress,
  inscricao_imob: '',
  telefone: '',
  email: '',
  val_capital_social: 1, // ✅ CORREÇÃO: 1 em vez de 0 (deve ser positivo)
  capital_integralizado: false,
  empresa_anexa_resid: false,
  endereco_apenas_contato: false,
  area_empresa: 1, // ✅ CORREÇÃO: 1 em vez de 0 (deve ser positivo)
  info_adicionais: defaultInfoAdicionais,
};

export const defaultSocio: Socio = {
  nome: '',
  nacionalidade: 'Brasileira',
  data_nascimento: '',
  estado_civil: 'solteiro', // ✅ CORREÇÃO: valor válido em vez de 'as any'
  profissao: '',
  cpf: '',
  rg: '',
  orgao_expedidor: '',
  uf: '',
  administrador: false,
  qtd_cotas: 1, // ✅ CORREÇÃO: 1 em vez de 0 (deve ser positivo)
  endereco: defaultAddress,
};
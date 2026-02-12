import { z } from 'zod';
import {
  _companyData,
  _partners,
  viacepSchema,
  openingFormSchemaResponse,
} from '@form/index';

export type CompanyData = z.infer<typeof _companyData>;
export type PartnersData = z.infer<typeof _partners>;
export type OpeningForm = z.infer<typeof openingFormSchemaResponse>;
export type OpeningFormData = z.infer<typeof openingFormSchemaResponse>;
export type ViaCep = z.infer<typeof viacepSchema>;
export type Socio = PartnersData['socios'][0];
export type Address = CompanyData['endereco'];

export interface CorporateFormData {
  companyData?: CompanyData;
  partnersData?: PartnersData | undefined;
}

export interface FormState {
  currentStep: number;
  formData: CorporateFormData;
  isSubmitting: boolean;
  isCompleted: boolean;
  isDataLoaded: boolean;
  errors: Record<string, string[]>;
}
import { API_ENDPOINTS } from '@flowtec/routes/endpoints';
import { CNPJ } from '../../domain/cnpj-cpf-validation';
import { Management } from '../../schemas/management.schema';
import fetcher from '@flowtec/lib/axios';

const api = API_ENDPOINTS;

export async function create(data: CNPJ) {
  const response = await fetcher.post(
    api.accountings.createContabilidade,
    data,
  );
  return response.data;
}

export async function get(): Promise<Management> {
  const response = await fetcher.get<Management>(
    api.accountings.listContabilidades,
  );
  return response.data; // Extract just the data
}

export async function _delete(id: string) {
  const response = await fetcher.delete(
    api.accountings.deleteContabilidade(id),
  );
  return response.data;
}

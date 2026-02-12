'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@shadcn/index';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { CompanyData } from '@form/index';

interface Props {
  companyData?: CompanyData | undefined; // ✅ Explicitamente aceita undefined
  onEdit: () => void;
  hasErrors: boolean;
}

export const CompanyReviewSection = ({
  companyData,
  onEdit,
  hasErrors,
}: Props) => {
  if (!companyData) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <XCircle className="w-5 h-5 mr-2" />
            Dados da Empresa - Não Encontrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            Os dados da empresa não foram preenchidos.
          </p>
          <Button onClick={onEdit} className="mt-4" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Preencher Dados da Empresa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border ${hasErrors ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle
            className={`flex items-center ${hasErrors ? 'text-red-700' : 'text-green-700'}`}
          >
            {hasErrors ? (
              <XCircle className="w-5 h-5 mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            Dados da Empresa
          </CardTitle>
          <Button onClick={onEdit} size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Nome Fantasia:</strong>
            <p className="text-gray-700">
              {companyData.nome_fantasia || '❌ Não informado'}
            </p>
          </div>
          <div>
            <strong>Email:</strong>
            <p className="text-gray-700">
              {companyData.email || '❌ Não informado'}
            </p>
          </div>
          <div>
            <strong>Telefone:</strong>
            <p className="text-gray-700">
              {companyData.telefone || '❌ Não informado'}
            </p>
          </div>
          <div>
            <strong>Capital Social:</strong>
            <p className="text-gray-700">
              R${' '}
              {companyData.val_capital_social?.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              }) || '❌ Não informado'}
            </p>
          </div>
        </div>

        <div>
          <strong>Endereço:</strong>
          <p className="text-gray-700">
            {companyData.endereco
              ? `${companyData.endereco.rua}, ${companyData.endereco.numero} - ${companyData.endereco.bairro}, ${companyData.endereco.municipio}/${companyData.endereco.uf} - CEP: ${companyData.endereco.cep}`
              : '❌ Endereço não informado'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Capital Integralizado:</strong>
            <p className="text-gray-700">
              {companyData.capital_integralizado ? 'Sim' : 'Não'}
              {!companyData.capital_integralizado &&
                companyData.data_integralizacao && (
                  <span className="block text-sm">
                    Data:{' '}
                    {new Date(
                      companyData.data_integralizacao,
                    ).toLocaleDateString('pt-BR')}
                  </span>
                )}
            </p>
          </div>
          <div>
            <strong>Área da Empresa:</strong>
            <p className="text-gray-700">
              {companyData.area_empresa || '❌ Não informado'} m²
            </p>
          </div>
        </div>

        {companyData.info_adicionais?.resp_tecnica && (
          <div className="border-t pt-4">
            <strong>Responsabilidade Técnica:</strong>
            <div className="ml-4 space-y-2">
              <p>
                <strong>Nome:</strong>{' '}
                {companyData.info_adicionais.nome_responsavel ||
                  '❌ Não informado'}
              </p>
              <p>
                <strong>Carteira:</strong>{' '}
                {companyData.info_adicionais.nmr_carteira_profissional ||
                  '❌ Não informado'}
              </p>
              <p>
                <strong>UF:</strong>{' '}
                {companyData.info_adicionais.uf || '❌ Não informado'}
              </p>
              <p>
                <strong>Área:</strong>{' '}
                {companyData.info_adicionais.area_resp || '❌ Não informado'} m²
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
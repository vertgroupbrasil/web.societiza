'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/index';
import { Building, Mail, Phone, MapPin, DollarSign } from 'lucide-react';
import { CompanyData } from '@form/index';

interface Props {
  companyData: CompanyData;
}

export const CompanyViewSection = ({ companyData }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Dados da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoField
            icon={<Building className="w-4 h-4" />}
            label="Nome Fantasia"
            value={companyData.nome_fantasia}
          />
          
          <InfoField
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={companyData.email}
          />
          
          <InfoField
            icon={<Phone className="w-4 h-4" />}
            label="Telefone"
            value={companyData.telefone}
          />
          
          <InfoField
            icon={<DollarSign className="w-4 h-4" />}
            label="Capital Social"
            value={`R$ ${companyData.val_capital_social?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`}
          />
          
          <InfoField
            label="Área da Empresa"
            value={`${companyData.area_empresa || 0} m²`}
          />
          
          <InfoField
            label="Capital Integralizado"
            value={companyData.capital_integralizado ? 'Sim' : 'Não'}
          />
        </div>

        {!companyData.capital_integralizado && companyData.data_integralizacao && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Data de Integralização:</strong> {new Date(companyData.data_integralizacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-900">Endereço</h4>
          </div>
          <div className="space-y-1 text-sm text-gray-700">
            <p>{companyData.endereco.rua}, {companyData.endereco.numero}</p>
            {companyData.endereco.complemento && <p>{companyData.endereco.complemento}</p>}
            <p>{companyData.endereco.bairro} - {companyData.endereco.municipio}/{companyData.endereco.uf}</p>
            <p>CEP: {companyData.endereco.cep}</p>
          </div>
        </div>

        {companyData.opcoes_nome_empresa && companyData.opcoes_nome_empresa.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Opções de Nome da Empresa</h4>
            <div className="space-y-2">
              {companyData.opcoes_nome_empresa.map((nome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{nome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {companyData.info_adicionais?.resp_tecnica && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Responsabilidade Técnica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField
                label="Nome do Responsável"
                value={companyData.info_adicionais.nome_responsavel || 'N/A'}
              />
              <InfoField
                label="Carteira Profissional"
                value={companyData.info_adicionais.nmr_carteira_profissional || 'N/A'}
              />
              <InfoField
                label="UF da Carteira"
                value={companyData.info_adicionais.uf || 'N/A'}
              />
              <InfoField
                label="Área de Responsabilidade"
                value={`${companyData.info_adicionais.area_resp || 0} m²`}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InfoField = ({ 
  icon, 
  label, 
  value 
}: { 
  icon?: React.ReactNode; 
  label: string; 
  value: string; 
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);
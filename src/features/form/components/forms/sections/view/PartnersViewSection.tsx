'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/index';
import { Users, Crown, MapPin, User } from 'lucide-react';
import { PartnersData } from '@form/index';

interface Props {
  partnersData: PartnersData;
}

export const PartnersViewSection = ({ partnersData }: Props) => {
  if (!partnersData?.socios?.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Nenhum sócio cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  const totalQuotas = partnersData.socios.reduce(
    (sum, socio) => sum + (socio.qtd_cotas || 0),
    0,
  );
  const administrators = partnersData.socios.filter(
    (socio) => socio.administrador,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Sócios ({partnersData.socios.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {partnersData.socios.length}
            </p>
            <p className="text-sm text-blue-600">Total de Sócios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {totalQuotas.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">Total de Cotas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {administrators.length}
            </p>
            <p className="text-sm text-blue-600">Administradores</p>
          </div>
        </div>

        <div className="space-y-4">
          {partnersData.socios.map((socio, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h4 className="text-lg font-semibold">{socio.nome}</h4>
                    {socio.administrador && (
                      <div>
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span>Administrador</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{socio.qtd_cotas || 0} cotas</p>
                    <p className="text-sm text-gray-600">
                      (
                      {totalQuotas > 0
                        ? (
                            ((socio.qtd_cotas || 0) / totalQuotas) *
                            100
                          ).toFixed(1)
                        : 0}
                      %)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <InfoField label="CPF" value={socio.cpf} />
                  <InfoField
                    label="Nacionalidade"
                    value={socio.nacionalidade}
                  />
                  <InfoField label="Profissão" value={socio.profissao} />
                  <InfoField
                    label="Estado Civil"
                    value={
                      socio.estado_civil +
                      (socio.estado_civil === 'casado' && socio.regime_casamento
                        ? ` (${socio.regime_casamento.replace('_', ' ')})`
                        : '')
                    }
                  />
                  <InfoField
                    label="Data Nascimento"
                    value={
                      socio.data_nascimento
                        ? new Date(socio.data_nascimento).toLocaleDateString(
                            'pt-BR',
                          )
                        : 'N/A'
                    }
                  />
                  <InfoField
                    label="RG"
                    value={`${socio.rg} - ${socio.orgao_expedidor}/${socio.uf}`}
                  />
                </div>

                {socio.endereco && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">
                        Endereço
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        {socio.endereco.rua}, {socio.endereco.numero}
                      </p>
                      {socio.endereco.complemento && (
                        <p>{socio.endereco.complemento}</p>
                      )}
                      <p>
                        {socio.endereco.bairro} - {socio.endereco.municipio}/
                        {socio.endereco.uf}
                      </p>
                      <p>CEP: {socio.endereco.cep}</p>
                    </div>
                  </div>
                )}

                {socio.administrador && socio.tipo_administrador && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">
                      Administração:{' '}
                      {socio.tipo_administrador.replace('_', ' ')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-gray-600">{label}</p>
    <p className="text-sm text-gray-900">{value || 'N/A'}</p>
  </div>
);

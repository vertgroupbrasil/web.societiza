'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@shadcn/index';
import { Edit, CheckCircle, XCircle, Users } from 'lucide-react';
import { PartnersData } from '@form/index';

interface Props {
  partnersData?: PartnersData | undefined;
  onEdit: () => void;
  hasErrors: boolean;
  totalQuotas: number;
  administrators: any[];
}

export const PartnersReviewSection = ({
  partnersData,
  onEdit,
  hasErrors,
  totalQuotas,
  administrators,
}: Props) => {
  if (!partnersData?.socios?.length) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <XCircle className="w-5 h-5 mr-2" />
            Dados dos Sócios - Não Encontrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Nenhum sócio foi cadastrado.</p>
          <Button onClick={onEdit} className="mt-4" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Cadastrar Sócios
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
            Dados dos Sócios ({partnersData.socios.length})
          </CardTitle>
          <Button onClick={onEdit} size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <p className="text-sm text-blue-600">Total de Sócios</p>
            <p className="font-bold text-blue-800">
              {partnersData.socios.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-600">Total de Cotas</p>
            <p className="font-bold text-blue-800">
              {totalQuotas.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-600">Administradores</p>
            <p className="font-bold text-blue-800">{administrators.length}</p>
          </div>
        </div>

        {/* Lista de Sócios */}
        <div className="space-y-4">
          {partnersData.socios.map((socio, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-lg">
                  Sócio {index + 1}
                  {socio.administrador && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Administrador
                    </span>
                  )}
                </h4>
                <div className="text-sm text-gray-600">
                  {socio.qtd_cotas} cotas (
                  {((socio.qtd_cotas / totalQuotas) * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Nome:</strong>
                  <p className="text-gray-700">
                    {socio.nome || '❌ Não informado'}
                  </p>
                </div>
                <div>
                  <strong>CPF:</strong>
                  <p className="text-gray-700">
                    {socio.cpf || '❌ Não informado'}
                  </p>
                </div>
                <div>
                  <strong>Nacionalidade:</strong>
                  <p className="text-gray-700">
                    {socio.nacionalidade || '❌ Não informado'}
                  </p>
                </div>
                <div>
                  <strong>Profissão:</strong>
                  <p className="text-gray-700">
                    {socio.profissao || '❌ Não informado'}
                  </p>
                </div>
                <div>
                  <strong>Estado Civil:</strong>
                  <p className="text-gray-700">
                    {socio.estado_civil || '❌ Não informado'}
                    {socio.estado_civil === 'casado' &&
                      socio.regime_casamento && (
                        <span className="block text-xs text-gray-500">
                          ({socio.regime_casamento.replace('_', ' ')})
                        </span>
                      )}
                  </p>
                </div>
                <div>
                  <strong>Data Nascimento:</strong>
                  <p className="text-gray-700">
                    {socio.data_nascimento
                      ? new Date(socio.data_nascimento).toLocaleDateString(
                          'pt-BR',
                        )
                      : '❌ Não informado'}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <strong>Endereço:</strong>
                <p className="text-gray-700 text-sm">
                  {socio.endereco
                    ? `${socio.endereco.rua}, ${socio.endereco.numero} - ${socio.endereco.bairro}, ${socio.endereco.municipio}/${socio.endereco.uf}`
                    : '❌ Endereço não informado'}
                </p>
              </div>

              {socio.administrador && socio.tipo_administrador && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <strong>Tipo de Administração:</strong>{' '}
                  {socio.tipo_administrador.replace('_', ' ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
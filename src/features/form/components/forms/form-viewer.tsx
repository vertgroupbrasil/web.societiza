'use client';

import { Card } from '@shadcn/index';
import { 
  useFormQueries, 
  CompanyViewSection, 
  PartnersViewSection 
} from '@form/index';

interface Props {
  processoId: string;
}

export const FormViewer = ({ processoId }: Props) => {
  const { formData, isLoading, error } = useFormQueries(processoId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-600">Carregando formulário...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Erro ao carregar o formulário</p>
        <p className="text-gray-500 text-sm mt-2">
          Verifique se o ID do processo está correto
        </p>
      </Card>
    );
  }

  if (!formData) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Formulário não encontrado</p>
      </Card>
    );
  }

  // ✅ Garante que processo_id sempre existe em companyData
  const companyData = {
    processo_id: processoId,
    ...formData,
  };

  const partnersData = {
    empresa_id: processoId,
    socios: formData.socios || [],
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <CompanyViewSection companyData={companyData} />
      <PartnersViewSection partnersData={partnersData} />
    </div>
  );
};
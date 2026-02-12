
import { FormRenderer, FormProvider } from '@form/index';

interface FormPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ step?: string }>;
}

export default async function FormPage({ params, searchParams }: FormPageProps) {
  const { id } = await params;
  const { step } = await searchParams;
  const initialStep = step ? parseInt(step) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Formulário de Abertura
          </h1>
          <p className="text-gray-600">Processo: {id}</p>
        </div>

        <FormProvider processoId={id} initialStep={initialStep}>
          <FormRenderer />
        </FormProvider>
      </div>
    </div>
  );
}
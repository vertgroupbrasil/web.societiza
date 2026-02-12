import { FormViewer } from '@form/index';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FormViewPage({ params }: Props) {
  const { id } = await params;
  return <FormViewer processoId={id} />;
}

export const metadata = {
  title: 'Visualização do Formulário',
  description:
    'Visualize os detalhes do formulário de abertura de empresa submetido.',
};
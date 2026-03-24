import { TemplateBuilder } from '@workflow-template/index';

interface TemplateBuilderPageProps {
  params: Promise<{ id: string }>;
}

export default async function TemplateBuilderPage({
  params,
}: TemplateBuilderPageProps) {
  const { id } = await params;

  return (
    <div className="h-full w-full">
      <TemplateBuilder templateId={id} />
    </div>
  );
}

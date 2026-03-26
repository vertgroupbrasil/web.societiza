import { TemplateBuilder } from '@workflow-template/index';

export default async function TemplateBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-full w-full">
      <TemplateBuilder templateId={id} />
    </div>
  );
}

import { OfficeSettingsScreen } from '@societiza/features/accountancy-offices/components/OfficeSettingsScreen';

// TODO: substituir por ID real do escritório ativo do usuário autenticado
// quando a autenticação estiver integrada com a feature de offices
const MOCK_ACTIVE_OFFICE_ID = 'office-001';

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <OfficeSettingsScreen officeId={MOCK_ACTIVE_OFFICE_ID} />
    </div>
  );
}

import { OfficeSettingsScreen } from '@societiza/features/accountancy-offices/components/OfficeSettingsScreen';

const MOCK_ACTIVE_OFFICE_ID = 'office-001';

export default function ConfiguracaoDoEscritorioPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
      <OfficeSettingsScreen officeId={MOCK_ACTIVE_OFFICE_ID} />
    </div>
  );
}

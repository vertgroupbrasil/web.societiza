import { OfficePlanScreen } from '@societiza/features/accountancy-offices/components/OfficePlanScreen';

// TODO: substituir por ID real do escritório ativo
const MOCK_ACTIVE_OFFICE_ID = 'office-001';

export default function PlanoPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      <OfficePlanScreen officeId={MOCK_ACTIVE_OFFICE_ID} />
    </div>
  );
}

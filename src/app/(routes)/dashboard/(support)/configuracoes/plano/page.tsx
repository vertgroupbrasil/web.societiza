import { OfficePlanScreen } from '@societiza/features/accountancy-offices/components/OfficePlanScreen';

const MOCK_ACTIVE_OFFICE_ID = 'office-001';

export default function PlanoPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
      <OfficePlanScreen officeId={MOCK_ACTIVE_OFFICE_ID} />
    </div>
  );
}

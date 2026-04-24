import { OfficeMembersScreen } from '@societiza/features/accountancy-offices/components/OfficeMembersScreen';

const MOCK_ACTIVE_OFFICE_ID = 'office-001';
const MOCK_CURRENT_USER_ID = 'member-001';

export default function MembrosPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
      <OfficeMembersScreen
        officeId={MOCK_ACTIVE_OFFICE_ID}
        currentUserId={MOCK_CURRENT_USER_ID}
      />
    </div>
  );
}

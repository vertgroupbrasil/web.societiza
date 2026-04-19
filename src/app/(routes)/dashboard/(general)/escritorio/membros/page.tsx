import { OfficeMembersScreen } from '@societiza/features/accountancy-offices/components/OfficeMembersScreen';

// TODO: substituir por ID real do escritório ativo e ID do usuário autenticado
const MOCK_ACTIVE_OFFICE_ID = 'office-001';
const MOCK_CURRENT_USER_ID = 'member-001';

export default function MembrosPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
      <OfficeMembersScreen
        officeId={MOCK_ACTIVE_OFFICE_ID}
        currentUserId={MOCK_CURRENT_USER_ID}
      />
    </div>
  );
}

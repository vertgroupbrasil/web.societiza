import { SystemAdminPanelScreen } from '@societiza/features/identity-users/components/SystemAdminPanelScreen';

export default function AdminPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
      <SystemAdminPanelScreen />
    </div>
  );
}

import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import PasswordForm from "@/components/admin/PasswordForm";

export const metadata = { title: "Settings — Upstage Admin" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-2">Site Settings</h1>
      <p className="text-sm text-muted mb-8">
        Changes here update the public website instantly — no code needed.
      </p>
      <SettingsForm initialSettings={settings} />

      <div className="mt-6">
        <PasswordForm />
      </div>
    </div>
  );
}

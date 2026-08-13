import { getSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";
import PasswordForm from "@/components/admin/PasswordForm";
import { ContentIn } from "@/components/Skeleton";

export const metadata = { title: "Settings — Upstage Admin" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-2">Site Settings</h1>
      <p className="text-sm text-muted mb-8">
        Changes here update the public website instantly — no code needed.
      </p>
      {/* Staggered: the settings stack is tall, and resolving it in two beats
          reads as the page settling rather than as one abrupt swap. */}
      <ContentIn>
        <SettingsForm initialSettings={settings} />
      </ContentIn>

      <ContentIn delay={90} className="mt-6">
        <PasswordForm />
      </ContentIn>
    </div>
  );
}

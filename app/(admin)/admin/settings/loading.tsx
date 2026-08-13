import { LoadingRegion } from "@/components/Skeleton";
import { SettingsCardSkeleton } from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-2">Site Settings</h1>
      <p className="text-sm text-muted mb-8">
        Changes here update the public website instantly — no code needed.
      </p>
      <LoadingRegion label="Loading site settings">
        <div className="space-y-6 max-w-2xl">
          <SettingsCardSkeleton heading="Homepage — Hero" fields={1} />
          <SettingsCardSkeleton
            heading="Homepage — About"
            fields={0}
            textarea
          />
          <SettingsCardSkeleton
            heading="Homepage — Current Show"
            split
            textarea
            fields={1}
          />
          <SettingsCardSkeleton heading="Auditions" fields={1} textarea />
          <SettingsCardSkeleton heading="Contact & Payment" fields={2} />
          <SettingsCardSkeleton
            heading="Change Password"
            fields={2}
            action="Update Password"
          />
        </div>
      </LoadingRegion>
    </div>
  );
}

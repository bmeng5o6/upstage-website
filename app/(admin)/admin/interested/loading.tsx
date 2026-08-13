import { LoadingRegion } from "@/components/Skeleton";
import {
  AdminTableSkeleton,
  ToolbarSkeleton,
} from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-2">Audition Interests</h1>
      <p className="text-sm text-muted mb-8">
        Everyone who asked to hear about auditions. Export the opted-in list as
        CSV to send a mailout.
      </p>
      <LoadingRegion label="Loading audition interest signups">
        <ToolbarSkeleton controls={2} trailing />
        <AdminTableSkeleton
          headers={[
            "Name",
            "Email",
            "Year",
            "Part",
            "Email opt-in",
            "Notes",
            "Signed up",
            "",
          ]}
          widths={[
            "w-24",
            "w-40",
            "w-10",
            "w-16",
            "w-10",
            "w-24",
            "w-20",
            "w-14",
          ]}
          rows={8}
        />
      </LoadingRegion>
    </div>
  );
}

import { LoadingRegion } from "@/components/Skeleton";
import {
  AdminTableSkeleton,
  ToolbarSkeleton,
} from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Reservations</h1>
      <LoadingRegion label="Loading reservations">
        <ToolbarSkeleton controls={2} />
        <AdminTableSkeleton
          headers={[
            "Name",
            "Email",
            "Show",
            "Qty",
            "Notes",
            "Status",
            "Date",
            "Actions",
          ]}
          widths={[
            "w-24",
            "w-36",
            "w-32",
            "w-6",
            "w-20",
            "w-16",
            "w-20",
            "w-24",
          ]}
          rows={8}
        />
      </LoadingRegion>
    </div>
  );
}

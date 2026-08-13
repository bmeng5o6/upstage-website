import { LoadingRegion } from "@/components/Skeleton";
import {
  StatCardsSkeleton,
  AdminTableSkeleton,
} from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Dashboard</h1>
      <LoadingRegion label="Loading dashboard">
        <StatCardsSkeleton />
        <AdminTableSkeleton
          cellClass="px-6 py-3"
          headers={["Name", "Show", "Qty", "Status", "Date"]}
          widths={["w-28", "w-40", "w-6", "w-16", "w-20"]}
          rows={6}
          title={
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-navy">Recent Reservations</h2>
              <span className="text-sm text-navy/30">View all →</span>
            </div>
          }
        />
      </LoadingRegion>
    </div>
  );
}

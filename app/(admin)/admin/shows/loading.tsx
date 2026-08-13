import { LoadingRegion } from "@/components/Skeleton";
import {
  ManagerHeaderSkeleton,
  ShowRowsSkeleton,
} from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Shows</h1>
      <LoadingRegion label="Loading shows">
        <ManagerHeaderSkeleton action="+ Add Show" />
        <ShowRowsSkeleton rows={3} />
      </LoadingRegion>
    </div>
  );
}

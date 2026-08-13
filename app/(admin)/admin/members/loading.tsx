import { LoadingRegion } from "@/components/Skeleton";
import {
  ManagerHeaderSkeleton,
  MemberRowsSkeleton,
} from "@/components/admin/AdminSkeletons";

export default function Loading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Members</h1>
      <LoadingRegion label="Loading members">
        <ManagerHeaderSkeleton action="+ Add Member" />
        <MemberRowsSkeleton rows={6} />
      </LoadingRegion>
    </div>
  );
}

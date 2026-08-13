import { Suspense } from "react";
import TicketForm from "@/components/TicketForm";
import { FormSkeleton, LoadingRegion } from "@/components/Skeleton";
import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Get Tickets — Upstage A Cappella",
};

export default async function TicketsPage() {
  const s = await getSettings();

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight mb-3">
          See us live!
        </h1>
        <p className="text-gray-500 mb-10">
          Fill out the form to reserve your tickets now! Payment via Venmo{" "}
          <strong className="text-navy">{s.venmo_handle}</strong> or cash at
          the door.
        </p>
        <Suspense
          fallback={
            <LoadingRegion label="Loading ticket form">
              <FormSkeleton />
            </LoadingRegion>
          }
        >
          <TicketForm venmoHandle={s.venmo_handle} />
        </Suspense>
      </div>
    </div>
  );
}

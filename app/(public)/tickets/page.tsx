import { Suspense } from "react";
import TicketForm from "@/components/TicketForm";

export const metadata = {
  title: "Get Tickets — Upstage A Cappella",
};

export default function TicketsPage() {
  return (
    <div className="pt-24">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
          Ticketing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-3">
          Reserve your spot.
        </h1>
        <p className="text-gray-500 mb-10">
          Fill out the form and we&apos;ll confirm your reservation within 24
          hours. Payment via Venmo{" "}
          <strong className="text-navy">@upstage-acappella</strong> or cash at
          the door.
        </p>
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-surface rounded-2xl" />
          }
        >
          <TicketForm />
        </Suspense>
      </div>
    </div>
  );
}

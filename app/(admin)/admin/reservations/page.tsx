import { createClient } from "@/lib/supabase/server";
import ReservationsTable from "@/components/admin/ReservationsTable";
import type { Reservation } from "@/lib/types";

type ReservationRow = Reservation & {
  shows: { title: string; time: string; date: string } | null;
};
type ShowOption = { id: string; title: string; time: string; date: string };

export const metadata = { title: "Reservations — Upstage Admin" };

export default async function ReservationsPage() {
  const supabase = await createClient();

  const [reservationsResult, showsResult] = supabase
    ? await Promise.all([
        supabase.from("reservations").select("*, shows(title, time, date)").order("created_at", { ascending: false }),
        supabase.from("shows").select("id, title, time, date").order("date"),
      ])
    : [{ data: null }, { data: null }];

  const reservations = reservationsResult.data as ReservationRow[] | null;
  const shows = showsResult.data as ShowOption[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Reservations</h1>
      <ReservationsTable
        initialReservations={reservations ?? []}
        shows={shows ?? []}
      />
    </div>
  );
}

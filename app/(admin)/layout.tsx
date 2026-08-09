import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) redirect("/auth/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Being signed in isn't enough — the account must actually hold a role.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role;
  if (role !== "admin" && role !== "super_admin") redirect("/auth/login");

  return (
    <div className="min-h-screen flex bg-surface">
      <AdminNav userEmail={user.email ?? ""} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

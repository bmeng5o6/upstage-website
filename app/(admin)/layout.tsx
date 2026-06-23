// PREVIEW MODE — auth disabled for local testing
// Re-enable before deploying: uncomment the Supabase block and remove the mock email
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: re-enable when Supabase is connected
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen flex bg-surface">
      <AdminNav userEmail="preview@upenn.edu" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

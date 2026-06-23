import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("YOUR_PROJECT_ID");

// Returns null when Supabase isn't configured — callers fall back to empty data.
export async function createClient() {
  if (!CONFIGURED) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — cookie writes are best-effort
          }
        },
      },
    }
  );
}

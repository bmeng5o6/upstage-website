"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "▤" },
  { href: "/admin/shows", label: "Shows", icon: "🎭" },
  { href: "/admin/reservations", label: "Reservations", icon: "🎟" },
  { href: "/admin/members", label: "Members", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside className="w-56 bg-navy text-white flex flex-col min-h-screen shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <p className="font-bold tracking-widest uppercase text-sm">Upstage</p>
        <p className="text-xs text-white/40 mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-xs text-white/40 truncate mb-2">{userEmail}</p>
        <Link href="/" className="block text-xs text-white/50 hover:text-white mb-2 transition-colors">
          ← View site
        </Link>
        <button
          onClick={signOut}
          className="text-xs text-white/50 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

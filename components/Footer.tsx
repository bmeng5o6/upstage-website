import Link from "next/link";
import { getSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSettings();

  const socials = [
    { label: "Instagram", url: s.instagram_url },
    { label: "YouTube", url: s.youtube_url },
    { label: "TikTok", url: s.tiktok_url },
    { label: "Spotify", url: s.spotify_url },
  ].filter((l) => l.url);

  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <p className="text-xl font-bold tracking-widest uppercase">Upstage</p>
          <p className="text-sm text-white/60 mt-1">A Cappella</p>
          <p className="text-sm text-white/40 mt-2">University of Pennsylvania</p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
            Navigate
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/#shows" className="hover:text-white transition-colors">Shows</Link></li>
            <li><Link href="/tickets" className="hover:text-white transition-colors">Tickets</Link></li>
            <li><Link href="/media" className="hover:text-white transition-colors">Media</Link></li>
            <li><Link href="/members" className="hover:text-white transition-colors">Members</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
            Follow Us
          </h4>
          {socials.length > 0 ? (
            <ul className="space-y-2 text-sm text-white/80">
              {socials.map((l) => (
                <li key={l.label}>
                  <a href={l.url} target="_blank" rel="noopener" className="hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/30">Add social links in Admin → Settings</p>
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
            Contact
          </h4>
          <p className="text-sm text-white/60 mb-1">Booking &amp; inquiries:</p>
          <a
            href={`mailto:${s.contact_email}`}
            className="text-sm text-white hover:text-white/70 transition-colors"
          >
            {s.contact_email}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-6 text-xs text-white/30">
        &copy; {new Date().getFullYear()} Upstage A Cappella. All rights reserved.
      </div>
    </footer>
  );
}

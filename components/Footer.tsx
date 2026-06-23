import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <p className="text-xl font-bold tracking-widest uppercase">Upstage</p>
          <p className="text-sm text-white/60 mt-1">A Cappella</p>
          <p className="text-sm text-white/40 mt-2">Cornell University</p>
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
          <ul className="space-y-2 text-sm text-white/80">
            {/* Replace # with your real social URLs */}
            <li><a href="https://instagram.com/YOUR_HANDLE" target="_blank" rel="noopener" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="https://youtube.com/@YOUR_HANDLE" target="_blank" rel="noopener" className="hover:text-white transition-colors">YouTube</a></li>
            <li><a href="https://tiktok.com/@YOUR_HANDLE" target="_blank" rel="noopener" className="hover:text-white transition-colors">TikTok</a></li>
            <li><a href="https://open.spotify.com/artist/YOUR_ID" target="_blank" rel="noopener" className="hover:text-white transition-colors">Spotify</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
            Contact
          </h4>
          <p className="text-sm text-white/60 mb-1">Booking &amp; inquiries:</p>
          <a
            href="mailto:upstage@cornell.edu"
            className="text-sm text-white hover:text-white/70 transition-colors"
          >
            upstage@cornell.edu
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-5 text-xs text-white/30">
        &copy; {new Date().getFullYear()} Upstage A Cappella. All rights reserved.
      </div>
    </footer>
  );
}

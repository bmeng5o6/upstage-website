"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#shows", label: "Shows" },
  { href: "/media", label: "Media" },
  { href: "/members", label: "Members" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Next's Link won't re-scroll when the hash already matches the URL, so
  // same-page anchors are scrolled by hand. Cross-page links fall through.
  function handleHashClick(e: React.MouseEvent, href: string) {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    if (pathname !== (href.slice(0, hashIndex) || "/")) return;

    e.preventDefault();
    const id = href.slice(hashIndex + 1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }

  const navBg =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-white/95 backdrop-blur-sm shadow-sm";

  const textColor = isHome && !scrolled ? "text-white" : "text-navy";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className={`font-bold text-lg tracking-widest uppercase ${textColor}`}
        >
          Upstage
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => handleHashClick(e, l.href)}
              className={`text-sm font-medium hover:opacity-70 transition-opacity ${textColor}`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/tickets"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-navy text-white hover:bg-navy-light transition-colors"
          >
            Get Tickets
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 ${textColor}`}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {open ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => {
                setOpen(false);
                handleHashClick(e, l.href);
              }}
              className="text-navy font-medium text-base"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/tickets"
            onClick={() => setOpen(false)}
            className="text-center font-semibold px-5 py-2.5 rounded-full bg-navy text-white"
          >
            Get Tickets
          </Link>
        </div>
      )}
    </header>
  );
}

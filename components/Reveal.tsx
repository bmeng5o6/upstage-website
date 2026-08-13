"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and lifts its children in as they scroll into view.
 *
 * The hidden state is applied on mount rather than during SSR, deliberately.
 * If the initial HTML shipped with opacity:0, then a JS error, a blocked
 * bundle, or a crawler without scripting would leave the page permanently
 * blank — a far worse outcome than losing an animation. Rendering visible and
 * then arming the effect degrades to "no animation" instead of "no content".
 *
 * Elements already on screen at mount are skipped entirely, so above-the-fold
 * content never flashes.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  /** Stagger, in ms. Use small offsets (~80ms) between siblings. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Already visible — animating it now would mean hiding something the user
    // is looking at.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect(); // one-shot; re-animating on scroll-up is nauseating
      },
      // Fire slightly before the element reaches the bottom edge, so the
      // motion reads as part of the scroll rather than a reaction to it.
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        hidden ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

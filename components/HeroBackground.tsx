"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "upstage:hero-motion";

function readStoredPreference(): boolean | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "off") return false;
    if (raw === "on") return true;
  } catch {

  }
  return null;
}

function storePreference(playing: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, playing ? "on" : "off");
  } catch {

  }
}

// fade in video in and out if select mute
/**
 * The hero's video background and its stop control.
 */
export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Until the effect runs we don't know the user's preference, so the control
  // stays hidden rather than rendering a button in a state that may be wrong.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredPreference();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // An explicit choice outranks the OS setting in both directions: someone
    // who turned the video on with reduced-motion enabled meant it.
    setPlaying(stored ?? !prefersReduced);
    setReady(true);
  }, []);

  const videoOn = ready && playing;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // The element only exists while the video is on, so this only ever starts
    // playback — switching off unmounts it. The promise rejects when the
    // browser declines to autoplay (iOS Low Power Mode is the common one);
    // fall back to the off state rather than leaving the button lying about it.
    video.play().catch(() => setPlaying(false));
  }, [videoOn]);

  function toggle() {
    const next = !playing;
    setPlaying(next);
    storePreference(next);
  }

  return (
    <>
      {videoOn ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-[url('/video/hero-poster.jpg')]"
            aria-hidden="true"
          />

          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            poster="/video/hero-poster.jpg"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>

          {/* Contrast scrim, in two parts, because the footage is brightly lit
              rather than dark. A single flat navy wash heavy enough to carry
              white text turns the magenta stage lighting to mud and throws away
              the only reason to run video here at all.

              So: a lighter vertical gradient that keeps the top and bottom
              edges dark (the navbar and the scroll arrow sit there) while
              letting colour through the middle... */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/40 to-navy/85"
            aria-hidden="true"
          />
          {/* ...plus a soft dark pool behind the text block only, so legibility
              is bought locally instead of across the whole frame. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 50% 45%, rgba(10,10,25,0.6) 0%, rgba(10,10,25,0.25) 45%, transparent 75%)",
            }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {ready && (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-8 right-6 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-navy/50 px-3.5 py-2 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-navy/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg width="15" height="12" viewBox="0 0 15 12" aria-hidden="true" fill="none">
            <path
              d="M1 6s2.2-4 6.5-4S14 6 14 6s-2.2 4-6.5 4S1 6 1 6Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <circle cx="7.5" cy="6" r="1.7" fill="currentColor" />
            {!playing && (
              <path d="M2 11L13 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            )}
          </svg>
          {/* Labelled by what the click does, not by current state — a button
              reading "Video off" is ambiguous about which way it will go. */}
          <span>{playing ? "Turn off video" : "Turn on video"}</span>
        </button>
      )}
    </>
  );
}

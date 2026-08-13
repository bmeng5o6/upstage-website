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

/**
 * The hero's video background and its stop control.
 */
export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Until the effect runs we don't know the user's preference, so the control
  // stays hidden rather than rendering a button in a state that may be wrong.
  const [ready, setReady] = useState(false);
  // Tracks whether the video is actually painting frames yet, as opposed to
  // merely being mounted — there is a real gap on first load while it fetches
  // and decodes, and crossfading over the poster hides that seam.
  const [painting, setPainting] = useState(false);
  /**
   * Latches true the first time the video is switched on, and never goes back.
   *
   * Switching off used to unmount the element, which meant every switch-on paid
   * for a fresh fetch and decode — that is the lag. Now the element survives:
   * off pauses it behind an opaque navy layer, so the visual result is the same
   * flat navy as before, but the decoded buffer and playback position are still
   * there when it comes back.
   *
   * It stays lazy, though. Someone who has switched the video off, or who has
   * reduced motion enabled, never mounts it and never downloads it.
   */
  const [everOn, setEverOn] = useState(false);

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
    if (videoOn) setEverOn(true);
  }, [videoOn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoOn) {
      // Rejects when the browser declines to autoplay (iOS Low Power Mode is
      // the common one); fall back to the off state rather than leaving the
      // button lying about it.
      video.play().catch(() => setPlaying(false));
      return;
    }

    // Pause immediately. The pane covering it is already opaque by this point,
    // so nothing is visible to freeze — and stopping the decoder is the whole
    // reason switching off is worth anything for battery.
    video.pause();
    // `everOn` matters: on the first switch-on the element does not exist yet
    // when this effect first runs, so it has to run again once mounting has
    // given us a ref, or playback would never start.
  }, [videoOn, everOn]);

  function toggle() {
    const next = !playing;
    setPlaying(next);
    storePreference(next);
  }

  return (
    <>
      {/* Deliberately NOT animated. Fading a container that holds the video
          forces group opacity: the browser has to render this whole subtree —
          poster, 1080p video, two full-screen gradients — into an offscreen
          buffer every frame and blend the result, which costs the video its
          hardware overlay. The navy pane below does the fading instead, so this
          layer is composited once and left alone. */}
      {everOn && (
        <div className="absolute inset-0" aria-hidden="true">
          {/* No poster layer, by either mechanism. The navy pane stays opaque
              until the video is genuinely painting frames, so a still would be
              occluded for its entire life — it would only ever cost an 8MB
              decoded bitmap and a compositor layer. Navy is the fallback. */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            onPlaying={() => setPainting(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* One source, H.264 720p. The VP9/WebM alternative came out the
                same size once both were tuned, and VP9 is frequently decoded in
                software where H.264 gets a dedicated hardware decoder — so it
                cost CPU and memory every frame and bought nothing. */}
            <source src="/video/hero-720.mp4" type="video/mp4" />
          </video>

          {/* Contrast scrim. The footage is brightly lit rather than dark, so a
              single flat navy wash heavy enough to carry white text turns the
              magenta stage lighting to mud. Instead: a vertical gradient that
              keeps the top and bottom edges dark (the navbar and the scroll
              arrow sit there) while letting colour through the middle, plus a
              soft pool behind the text block so legibility is bought locally.

              Both live on ONE element as stacked background images. As two
              elements they were two full-screen alpha blends composited over
              every decoded video frame, forever — merging them halves that
              standing cost and lifts the baseline frame rate. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 75% 55% at 50% 45%, rgba(10,10,25,0.6) 0%, rgba(10,10,25,0.25) 45%, transparent 75%)",
                "linear-gradient(to bottom, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.4) 50%, rgba(26,26,46,0.85) 100%)",
              ].join(", "),
            }}
          />
        </div>
      )}

      {/* Flat navy, carrying the same faint wash the hero had before there was
          any video. Opaque = video hidden, and the result is indistinguishable
          from the original navy hero. Transparent = video visible.

          Switched, not faded, and that is the whole point. A crossfade means
          recomputing a full-screen alpha blend every frame for its duration, at
          device-pixel resolution, while the video decoder is running — the two
          contend for the same GPU and the frame rate drops. There is no way to
          make that blend cheap; the only way to make it free is to not do it.
          A visibility toggle is a switch, and a switch is allowed to be
          instant. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: videoOn && painting ? 0 : 1,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%), var(--color-navy)",
        }}
        aria-hidden="true"
      />

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

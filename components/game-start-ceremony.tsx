"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createTimeline } from "animejs";

type CeremonyTimeline = ReturnType<typeof createTimeline>;
import { useClockGameLive } from "@/hooks/use-game-live";
import { useGameLiveOverride } from "@/hooks/game-live-override";
import { useGameStartCeremony } from "@/hooks/game-start-ceremony";
import { SITE_CONFIG } from "@/lib/site-config";

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MQ).matches;
}

function SecurityGuardResume() {
  return (
    <div className="gsc-resume">
      <header className="gsc-resume__header">
        <p className="gsc-resume__org">CSA&apos;s Pizza · Night Division</p>
        <h2 className="gsc-resume__title">Security Guard Resume</h2>
        <p className="gsc-resume__meta">Night Shift · Badge Pending</p>
      </header>
      <dl className="gsc-resume__body">
        <div>
          <dt>Objective</dt>
          <dd>
            Survive until 6 AM. Watch the cameras. Keep the doors closed. Don&apos;t
            check the vents twice. If something moves in the dark — it moved.
          </dd>
        </div>
        <div>
          <dt>Experience</dt>
          <dd>
            Night guard, CSA&apos;s Pizza, {SITE_CONFIG.gameYear - 1}–
            {SITE_CONFIG.gameYear}. Door power rationing, camera sweeps, and
            politely ignoring wet footprints that were not there at 12 AM.
            Prior: “Probably the wind” specialist.
          </dd>
        </div>
        <div>
          <dt>Skills</dt>
          <dd>
            Flashlight · Kill reports · Quest board · Power management · Not
            getting jumpscared · Knowing when to stop looking
          </dd>
        </div>
        <div>
          <dt>Certifications</dt>
          <dd>
            Night Shift Clearance · Vent Awareness Level I · Approved to hold a
            Nerf blaster after orientation
          </dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>
            Sundown to 6 AM. Willing to work weekends, campus-wide events, and
            any shift where the animatronics are “offline.”
          </dd>
        </div>
      </dl>
      <p className="gsc-resume__footer">
        CONFIDENTIAL — HvZ {SITE_CONFIG.gameYear}
      </p>
    </div>
  );
}

type CeremonyStageProps = {
  reduced: boolean;
  /** Flip site to live under the still-opaque scrim so hero layout work isn't visible. */
  onRevealLive: () => void;
  onComplete: () => void;
};

function CeremonyStage({
  reduced,
  onRevealLive,
  onComplete,
}: CeremonyStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const carrierRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const coverFrontRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const onRevealLiveRef = useRef(onRevealLive);
  const onCompleteRef = useRef(onComplete);
  const revealedRef = useRef(false);
  onRevealLiveRef.current = onRevealLive;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const scrim = scrimRef.current;
    const carrier = carrierRef.current;
    const cover = coverRef.current;
    const coverFront = coverFrontRef.current;
    const hand = handRef.current;
    const stamp = stampRef.current;
    if (!scrim || !carrier || !cover || !coverFront || !hand || !stamp) return;

    let tl: CeremonyTimeline | null = null;
    revealedRef.current = false;

    const revealLiveUnderScrim = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      // Sync under the opaque scrim so countdown collapse finishes before fade-out.
      onRevealLiveRef.current();
    };

    const finish = () => {
      // Safety: always reveal before dismissing, even if the mid-cue was skipped.
      revealLiveUnderScrim();
      onCompleteRef.current();
    };

    if (reduced) {
      tl = createTimeline({
        defaults: { ease: "outQuad" },
        onComplete: finish,
      });
      tl.set(hand, { opacity: 0 });
      tl.set(coverFront, { opacity: 0 });
      tl.set(cover, { rotateY: -172 });
      tl.set(carrier, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
      tl.add(scrim, { opacity: [0, 1], duration: 200 }, 0);
      tl.add(stamp, { opacity: [0, 1], scale: [1.15, 1], duration: 350 }, 120);
      // Reveal while scrim is still opaque, then fade the packet.
      tl.call(revealLiveUnderScrim, 500);
      tl.add(carrier, { opacity: 0, duration: 280 }, 620);
      return () => {
        // Pause only — revert() snaps poses back for a frame and causes end jank.
        tl?.pause();
      };
    }

    // Initial poses — CSS holds layout; anime owns motion.
    tl = createTimeline({
      defaults: { ease: "outExpo" },
      onComplete: finish,
    });

    tl.set(scrim, { opacity: 0 });
    tl.set(carrier, { x: "-120vw", rotate: -6, opacity: 0, y: 0, scale: 1 });
    tl.set(hand, { x: 0, z: 60, rotate: 0, opacity: 1 });
    tl.set(cover, { rotateY: 0 });
    tl.set(coverFront, { opacity: 1, visibility: "visible" });
    tl.set(stamp, { opacity: 0, scale: 2.5 });

    // 1) Scrim + packet slide in with hand gripping
    tl.add(scrim, { opacity: 1, duration: 420, ease: "outQuad" }, 0);
    tl.add(
      carrier,
      {
        x: 0,
        rotate: 0,
        opacity: 1,
        duration: 980,
        ease: "outCubic",
      },
      80,
    );

    // 2) Hand slides out left
    tl.add(
      hand,
      {
        x: "-140%",
        rotate: -12,
        opacity: 0,
        z: 60,
        duration: 680,
        ease: "inCubic",
      },
      1100,
    );

    // 3) Cover opens like a book (hinge left)
    tl.add(
      cover,
      {
        rotateY: [
          { to: -92, duration: 520, ease: "inCubic" },
          { to: -172, duration: 620, ease: "outCubic" },
        ],
      },
      1650,
    );
    // Title face fades at the edge-on moment so it never shows on the open leaf
    tl.add(
      coverFront,
      {
        opacity: [
          { to: 1, duration: 480, ease: "linear" },
          { to: 0, duration: 80, ease: "linear" },
        ],
        duration: 560,
      },
      1650,
    );
    tl.call(() => {
      if (coverFront) coverFront.style.visibility = "hidden";
    }, 2210);

    // 4) APPROVED stamp
    tl.add(
      stamp,
      {
        opacity: 1,
        scale: [
          { to: 2.5, duration: 0 },
          { to: 0.92, duration: 240, ease: "outQuad" },
          { to: 1.05, duration: 120, ease: "outQuad" },
          { to: 1, duration: 140, ease: "outQuad" },
        ],
        duration: 500,
        ease: "outExpo",
      },
      2900,
    );

    // Flip live UI under the opaque scrim before the packet/scrim exit so the
    // countdown collapse + badge swap aren't visible (and don't contend with fade-out).
    tl.call(revealLiveUnderScrim, 4000);

    // 5) Packet exits downward
    tl.add(
      carrier,
      {
        y: "110vh",
        scale: 0.92,
        opacity: 0,
        duration: 900,
        ease: "inCubic",
      },
      4200,
    );
    tl.add(scrim, { opacity: 0, duration: 420, ease: "inQuad" }, 4550);

    return () => {
      // Pause only — revert() snaps poses back for a frame and causes end jank.
      tl?.pause();
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className={[
        "gsc-stage",
        "gsc-stage--js",
        reduced ? "gsc-stage--reduced" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="Night shift assignment approved"
    >
      <div ref={scrimRef} className="gsc-scrim" />
      <div ref={carrierRef} className="gsc-carrier">
        <div className="gsc-folder">
          <div className="gsc-envelope">
            <div className="gsc-envelope__page">
              <SecurityGuardResume />
            </div>
            <div ref={coverRef} className="gsc-envelope__cover">
              <div ref={coverFrontRef} className="gsc-envelope__cover-front">
                <div className="gsc-envelope__label">
                  <span className="gsc-envelope__label-eyebrow">Personnel</span>
                  <span className="gsc-envelope__label-title">
                    Security Guard Resume
                  </span>
                  <span className="gsc-envelope__label-sub">
                    Night Shift Assignment
                  </span>
                </div>
              </div>
              <div className="gsc-envelope__cover-inside" aria-hidden="true" />
            </div>
          </div>

          <div ref={stampRef} className="gsc-stamp" aria-hidden="true">
            <span>APPROVED</span>
          </div>

          <div ref={handRef} className="gsc-hand" aria-hidden="true">
            <svg viewBox="0 0 120 160" className="gsc-hand__svg" fill="none">
              <path
                d="M18 70c0-8 6-14 14-14h8c4 0 6-4 6-8 0-5 4-9 9-9s9 4 9 9v6c0 3 2 5 5 5h2c5 0 9 4 9 9v8c0 3 2 5 5 5 5 0 9 4 9 9v28c0 18-14 32-32 32H48C30 150 18 138 18 120V70z"
                fill="#c4a882"
                stroke="#5c4a38"
                strokeWidth="3"
              />
              <path
                d="M18 88h28c6 0 10 4 10 10v20"
                stroke="#5c4a38"
                strokeWidth="2"
                opacity="0.35"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-screen pre→live ceremony: envelope delivery, book-open resume, APPROVED stamp, exit.
 * Motion is driven by anime.js. Mount only in the main site shell (not over the theme gate).
 */
export function GameStartCeremony() {
  const ctx = useGameStartCeremony();
  // Clock live (not deferred UI live) — ceremony starts at T=0; site UI flips after it ends.
  const clockLive = useClockGameLive();
  const override = useGameLiveOverride();
  const [reduced, setReduced] = useState(false);
  const [watching, setWatching] = useState(false);
  const prevClockLiveRef = useRef<boolean | null>(null);
  const clockLiveRef = useRef(clockLive);
  clockLiveRef.current = clockLive;

  const playing = ctx?.playing ?? false;
  const setPlaying = ctx?.setPlaying;
  const complete = ctx?.complete;
  const markLiveRevealed = ctx?.markLiveRevealed;
  const clearLiveRevealed = ctx?.clearLiveRevealed;
  const overrideSettled = override?.hydrated ?? true;

  useEffect(() => {
    if (!overrideSettled || watching) return;

    const id = window.setTimeout(() => {
      const alreadyLive = clockLiveRef.current;
      prevClockLiveRef.current = alreadyLive;
      // Pre-game: hold live UI until a future ceremony completes.
      // Already live: keep revealed (skip ceremony on hard-load).
      if (alreadyLive) markLiveRevealed?.();
      else clearLiveRevealed?.();
      setWatching(true);
    }, 80);

    return () => window.clearTimeout(id);
  }, [overrideSettled, watching, markLiveRevealed, clearLiveRevealed]);

  useLayoutEffect(() => {
    if (!watching || !setPlaying) return;
    const prev = prevClockLiveRef.current;

    if (prev === false && clockLive === true) {
      // Dev panel "Live" forces the flag without a timed transition — skip ceremony.
      if (override?.liveOverride === true) {
        markLiveRevealed?.();
      } else {
        setPlaying(true);
        // liveRevealed stays false until mid-ceremony reveal — prevents hero collapse at T=0.
      }
    }

    if (!clockLive) {
      clearLiveRevealed?.();
    }

    prevClockLiveRef.current = clockLive;
  }, [
    clockLive,
    watching,
    setPlaying,
    override?.liveOverride,
    markLiveRevealed,
    clearLiveRevealed,
  ]);

  useEffect(() => {
    if (!playing) return;
    setReduced(prefersReducedMotion());
  }, [playing]);

  // Lock body scroll + compensate scrollbar width so the page doesn't shift under the overlay.
  useLayoutEffect(() => {
    if (!playing) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollbarGap = window.innerWidth - html.clientWidth;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPadding = body.style.paddingRight;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPadding;
    };
  }, [playing]);

  if (!playing) return null;

  return (
    <div
      className={[
        "gsc-overlay",
        "gsc-overlay--js",
        reduced ? "gsc-overlay--reduced" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CeremonyStage
        reduced={reduced}
        onRevealLive={() => markLiveRevealed?.()}
        onComplete={() => complete?.()}
      />
    </div>
  );
}

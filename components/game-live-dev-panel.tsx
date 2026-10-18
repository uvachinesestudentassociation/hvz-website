"use client"

import { useState } from "react"
import { useGameLive } from "@/hooks/use-game-live"
import { useGameLiveOverride, duskPreviewMs } from "@/hooks/game-live-override"
import { getGameStartDate } from "@/lib/game-start"
import { PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles"

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-none border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
        "active:translate-x-[1px] active:translate-y-[1px]",
        active
          ? "border-[var(--px-dev-active-border)] bg-[var(--px-dev-active)] text-white"
          : "border-[var(--px-border)] bg-[var(--px-paper)] text-[var(--px-dev)]",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function formatStartCountdown(simulatedNow: number | null, live: boolean): string {
  if (live) return "flipped"
  if (simulatedNow == null) return "…"
  const ms = getGameStartDate().getTime() - simulatedNow
  const sec = Math.max(0, Math.ceil(ms / 1000))
  return sec === 0 ? "00:00 → live" : `${sec}s → live`
}

const shellClass = [
  "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-50 md:bottom-6 md:left-6 md:right-auto",
  `rounded-none border-4 ${PIXEL_SECTION_BORDER} bg-[var(--px-paper)]`,
  "shadow-[4px_4px_0_rgba(0,0,0,0.45)]",
].join(" ")

export function GameLiveDevPanel() {
  const ctx = useGameLiveOverride()
  const live = useGameLive()
  const [hidden, setHidden] = useState(false)

  if (!ctx?.enabled) return null
  if (hidden) {
    return (
      <button type="button" onClick={() => setHidden(false)} className={`${shellClass} px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--px-dev)]`}>
        Dev
      </button>
    )
  }

  const {
    liveOverride,
    setLiveOverride,
    replayStartPreview,
    simulatedNow,
    duskSpeed,
    setDuskSpeed,
    hallPreview,
    setHallPreview,
  } = ctx

  const duskSeconds = duskSpeed <= 0 ? 0 : Math.round(duskPreviewMs(duskSpeed) / 1000)

  const inStartPreview = liveOverride === "start"
  const showingLabel = inStartPreview
    ? live
      ? "Live @ T=0"
      : `Pre · ${formatStartCountdown(simulatedNow, live)}`
    : `Showing: ${live ? "Live" : "Pre-game"}`

  return (
    <div className={`${shellClass} max-w-[16rem] p-3`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--px-dev-muted)]">
          Dev · Game state
        </p>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--px-dev)]"
        >
          Hide
        </button>
      </div>
      <p className="mb-2 font-mono text-[11px] font-bold text-[var(--px-dev)]">
        {showingLabel}
      </p>
      <div className="mb-2 flex flex-wrap gap-1">
        <ModeButton active={liveOverride === null} onClick={() => setLiveOverride(null)}>
          Auto
        </ModeButton>
        <ModeButton
          active={liveOverride === false}
          onClick={() => setLiveOverride(false)}
        >
          Pre
        </ModeButton>
        <ModeButton active={liveOverride === true} onClick={() => setLiveOverride(true)}>
          Live
        </ModeButton>
        <ModeButton
          active={inStartPreview}
          onClick={() => {
            if (inStartPreview) replayStartPreview()
            else setLiveOverride("start")
          }}
        >
          T→0
        </ModeButton>
      </div>
      <label className="mt-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--px-dev)]">
        Hall lights
      </label>
      <div className="mt-1 flex flex-wrap gap-1">
        <ModeButton active={hallPreview === "auto"} onClick={() => setHallPreview("auto")}>
          Auto
        </ModeButton>
        <ModeButton active={hallPreview === "off"} onClick={() => setHallPreview("off")}>
          Off
        </ModeButton>
        <ModeButton active={hallPreview === "on"} onClick={() => setHallPreview("on")}>
          On
        </ModeButton>
        <ModeButton active={hallPreview === "flicker"} onClick={() => setHallPreview("flicker")}>
          Flicker
        </ModeButton>
      </div>
      <label className="mt-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--px-dev)]">
        Dusk speed
        <input
          type="range"
          min={0}
          max={100}
          value={duskSpeed}
          onChange={(event) => setDuskSpeed(Number(event.target.value))}
          className="mt-1 block w-full accent-[var(--px-dev-active)]"
        />
      </label>
      <p className="mt-2 font-mono text-[9px] leading-snug text-[var(--px-dev-muted)]">
        {duskSpeed > 0
          ? `Office dims across ${duskSeconds}s, then stays night. Slide to the left for real time.`
          : inStartPreview
            ? "T→0 counts 5s, flips live, then plays the resume ceremony. Click again to replay."
            : "Slide dusk speed to the right to dim the office faster. Or use ?live=0|1|start"}
      </p>
    </div>
  )
}

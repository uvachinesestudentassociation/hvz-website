"use client"

import { useGameLive } from "@/hooks/use-game-live"
import { useGameLiveOverride } from "@/hooks/game-live-override"
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
          ? "border-amber-700 bg-amber-500 text-white dark:border-amber-400 dark:bg-amber-600"
          : "border-[#8a7a68] bg-[#f5f0e6] text-[#5c4a38] dark:border-[#5c4d3a] dark:bg-[#2a2420] dark:text-amber-100/80",
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

export function GameLiveDevPanel() {
  const ctx = useGameLiveOverride()
  const live = useGameLive()

  if (!ctx?.enabled) return null

  const {
    liveOverride,
    setLiveOverride,
    replayStartPreview,
    simulatedNow,
  } = ctx

  const inStartPreview = liveOverride === "start"
  const showingLabel = inStartPreview
    ? live
      ? "Live @ T=0"
      : `Pre · ${formatStartCountdown(simulatedNow, live)}`
    : `Showing: ${live ? "Live" : "Pre-game"}`

  return (
    <div
      className={[
        "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-50 md:bottom-6 md:left-6 md:right-auto",
        `max-w-[16rem] rounded-none border-4 ${PIXEL_SECTION_BORDER} bg-[#f5f0e6] p-3`,
        "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:bg-[#2a2420] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#8a7a68] dark:text-amber-200/70">
        Dev · Game state
      </p>
      <p className="mb-2 font-mono text-[11px] font-bold text-[#5c4a38] dark:text-amber-100">
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
      <p className="mt-2 font-mono text-[9px] leading-snug text-[#8a7a68] dark:text-amber-200/50">
        {inStartPreview
          ? "T→0 counts 5s, flips live, then plays the resume ceremony. Click again to replay."
          : "Or use ?live=0|1|start"}
      </p>
    </div>
  )
}

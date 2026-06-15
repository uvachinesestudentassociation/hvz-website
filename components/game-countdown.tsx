"use client"

import { useEffect, useState } from "react"
import { useGameLive } from "@/hooks/use-game-live"
import { getGameStartLabel, getTimeUntilGameStart } from "@/lib/game-start"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { SITE_CONFIG } from "@/lib/site-config"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function parseTimeLeft(ms: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={[
          `min-w-[4.5rem] rounded-none border-4 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE} px-3 py-4 md:min-w-[5.5rem] md:px-4 md:py-5`,
          `font-mono text-3xl font-black tabular-nums ${PIXEL_TEXT} md:text-5xl`,
          "shadow-[6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[6px_6px_0_rgba(255,255,255,0.08)]",
        ].join(" ")}
      >
        {value.toString().padStart(2, "0")}
      </div>
      <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${PIXEL_TEXT_MUTED} md:text-xs`}>
        {label}
      </span>
    </div>
  )
}

export function GameCountdown() {
  const live = useGameLive()
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (live) {
      setTimeLeft(null)
      return
    }

    const tick = () => setTimeLeft(parseTimeLeft(getTimeUntilGameStart()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [live])

  if (live) {
    return (
      <div
        className={[
          `mx-auto mb-8 inline-block rounded-none border-4 ${PIXEL_SECTION_BORDER} bg-emerald-500 px-6 py-4`,
          `font-mono text-xl font-black uppercase tracking-wider ${PIXEL_TEXT} md:text-2xl`,
          "shadow-[6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[6px_6px_0_rgba(255,255,255,0.08)]",
        ].join(" ")}
      >
        {`>> GAME ON — HvZ ${SITE_CONFIG.gameYear} <<`}
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="mx-auto mb-8 max-w-3xl">
      <p className={`mb-3 font-mono text-sm font-bold uppercase tracking-[0.15em] ${PIXEL_TEXT} md:text-base`}>
        {">> Game starts in"}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <span className={`pb-6 font-mono text-2xl font-black ${PIXEL_TEXT} md:text-4xl`}>:</span>
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <span className={`pb-6 font-mono text-2xl font-black ${PIXEL_TEXT} md:text-4xl`}>:</span>
        <CountdownUnit value={timeLeft.minutes} label="Min" />
        <span className={`pb-6 font-mono text-2xl font-black ${PIXEL_TEXT} md:text-4xl`}>:</span>
        <CountdownUnit value={timeLeft.seconds} label="Sec" />
      </div>
      <p className={`mt-4 font-mono text-xs ${PIXEL_TEXT_MUTED} md:text-sm`}>{getGameStartLabel()}</p>
    </div>
  )
}

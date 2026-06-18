"use client"

import { useEffect, useState } from "react"
import { getNightShiftHour, type NightShiftHour } from "@/lib/game-start"
import { useGameLive } from "@/hooks/use-game-live"

export function useNightShift(): NightShiftHour | null {
  const live = useGameLive()
  const [hour, setHour] = useState<NightShiftHour | null>(null)

  useEffect(() => {
    if (!live) {
      setHour(null)
      return
    }

    const tick = () => setHour(getNightShiftHour())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [live])

  return hour
}

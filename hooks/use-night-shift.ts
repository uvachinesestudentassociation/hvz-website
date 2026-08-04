"use client"

import { useEffect, useState } from "react"
import { getNightShiftHour, type NightShiftHour } from "@/lib/game-start"
import { useGameLive } from "@/hooks/use-game-live"
import { useGameLiveOverride } from "@/hooks/game-live-override"

export function useNightShift(): NightShiftHour | null {
  const live = useGameLive()
  const override = useGameLiveOverride()
  const [hour, setHour] = useState<NightShiftHour | null>(null)

  useEffect(() => {
    if (!live) {
      setHour(null)
      return
    }

    if (override?.nightOverride != null) {
      setHour(override.nightOverride)
      return
    }

    const tick = () => setHour(getNightShiftHour())
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [live, override?.nightOverride])

  return hour
}

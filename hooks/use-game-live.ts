"use client"

import { useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"
import { useGameLiveOverride } from "@/hooks/game-live-override"

export function useGameLive() {
  const override = useGameLiveOverride()
  const [clockLive, setClockLive] = useState(false)

  useEffect(() => {
    const tick = () => setClockLive(isGameLive())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  if (override?.liveOverride !== null && override?.liveOverride !== undefined) {
    return override.liveOverride
  }

  return clockLive
}

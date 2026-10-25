"use client"

import { useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"
import { useGameLiveOverride } from "@/hooks/game-live-override"

/** Clock / override live flag for site UI. */
export function useGameLive() {
  const override = useGameLiveOverride()
  const [clockLive, setClockLive] = useState(false)

  useEffect(() => {
    const tick = () => setClockLive(isGameLive())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  if (override?.simulatedNow != null) {
    return isGameLive(override.simulatedNow)
  }

  if (override?.liveOverride === true) return true
  if (override?.liveOverride === false) return false

  return clockLive
}

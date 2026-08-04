"use client"

import { useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"
import { useGameLiveOverride } from "@/hooks/game-live-override"
import { useGameStartCeremony } from "@/hooks/game-start-ceremony"

/**
 * Raw clock / override live flag — ignores the start ceremony.
 * Use for edge detection (pre→live) that should fire when the timer hits zero.
 */
export function useClockGameLive() {
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

/**
 * Site live mode for UI. Stays pre-game until the start ceremony reveals live
 * (or Dev "Live" forces it). Avoids a one-frame layout shift at T=0.
 */
export function useGameLive() {
  const clockLive = useClockGameLive()
  const ceremony = useGameStartCeremony()
  const override = useGameLiveOverride()

  // Explicit force always wins.
  if (override?.liveOverride === true) return true
  if (override?.liveOverride === false) return false

  if (!clockLive) return false

  // Clock is past start — hold pre-game UI until ceremony reveal (or hard-load skip).
  if (ceremony && !ceremony.liveRevealed) return false

  return true
}

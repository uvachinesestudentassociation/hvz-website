"use client"

import { useEffect, useState } from "react"
import { useGameLiveOverride } from "@/hooks/game-live-override"
import { duskAmount, hallLightsFlicker, isDuskNight } from "@/lib/game-start"

export function useDusk() {
  const override = useGameLiveOverride()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    if (override?.simulatedNow != null) return
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [override?.simulatedNow])

  const clock = override?.duskScrub ?? override?.simulatedNow ?? now
  if (clock == null) return { amount: 0, night: false, flicker: false }
  return { amount: duskAmount(clock), night: isDuskNight(clock), flicker: hallLightsFlicker(clock) }
}

"use client"

import { useCallback, useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"
import { THEME_GATE } from "@/lib/theme-gate"

/**
 * Theme gate uses the real wall clock only — never the dev live override —
 * so forcing "pre-game" for UI preview cannot re-lock the site.
 */
export function useThemeGate() {
  const [clockLive, setClockLive] = useState(false)
  const [bypass, setBypass] = useState(false)

  useEffect(() => {
    const tick = () => setClockLive(isGameLive())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const showGate = THEME_GATE.enabled && !clockLive && !bypass

  const grantBypass = useCallback(() => {
    setBypass(true)
  }, [])

  return { showGate, grantBypass }
}

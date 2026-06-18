"use client"

import { useCallback, useState } from "react"
import { useGameLive } from "@/hooks/use-game-live"
import { THEME_GATE } from "@/lib/theme-gate"

export function useThemeGate() {
  const live = useGameLive()
  const [bypass, setBypass] = useState(false)

  const showGate = THEME_GATE.enabled && !live && !bypass

  const grantBypass = useCallback(() => {
    setBypass(true)
  }, [])

  return { showGate, grantBypass }
}

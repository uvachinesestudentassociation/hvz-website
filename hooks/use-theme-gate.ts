"use client"

import { useCallback, useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"
import { THEME_GATE } from "@/lib/theme-gate"

const BYPASS_STORAGE_KEY = "hvz-exec-preview-unlocked"

/**
 * Theme gate uses the real wall clock only — never the dev live override —
 * so forcing "pre-game" for UI preview cannot re-lock the site.
 *
 * A successful exec code unlock is persisted in localStorage so it survives reloads.
 */
export function useThemeGate() {
  const [clockLive, setClockLive] = useState(false)
  const [bypass, setBypass] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setBypass(window.localStorage.getItem(BYPASS_STORAGE_KEY) === "1")
    } catch {
      // Private mode / blocked storage — treat as not unlocked.
    }
    setReady(true)
  }, [])

  useEffect(() => {
    const tick = () => setClockLive(isGameLive())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const showGate = THEME_GATE.enabled && !clockLive && !bypass
  /** True until localStorage has been read — avoid flashing site content before unlock is known. */
  const resolving = THEME_GATE.enabled && !ready

  const grantBypass = useCallback(() => {
    try {
      window.localStorage.setItem(BYPASS_STORAGE_KEY, "1")
    } catch {
      // Still unlock this session even if persistence fails.
    }
    setBypass(true)
  }, [])

  return { showGate, grantBypass, resolving }
}

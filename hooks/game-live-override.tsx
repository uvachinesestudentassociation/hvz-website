"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getGameStartDate } from "@/lib/game-start"

/** null = follow real clock; true/false = force live / pre-game; "start" = simulate T→0 flip */
export type LiveOverride = boolean | null | "start"

/** Seconds shown on the countdown before the simulated flip to live. */
const START_PREVIEW_LEAD_SEC = 5

type GameLiveOverrideContextValue = {
  /** null = follow real clock; true/false = force live / pre-game; "start" = T→0 preview */
  liveOverride: LiveOverride
  setLiveOverride: (value: LiveOverride) => void
  /** Re-run the T→0 countdown even if already in start mode */
  replayStartPreview: () => void
  /**
   * When in start preview, a simulated Date.now() that advances toward game start
   * and freezes at T=0. null otherwise.
   */
  simulatedNow: number | null
  enabled: boolean
  /** True after session/query overrides have been read (always true when preview is disabled). */
  hydrated: boolean
}

const STORAGE_KEY = "hvz-dev-game-live-override"

const GameLiveOverrideContext = createContext<GameLiveOverrideContextValue | null>(null)

function isDevPreviewEnabled() {
  return process.env.NODE_ENV === "development"
}

function parseLiveParam(value: string | null): LiveOverride | undefined {
  if (value === "1" || value === "true" || value === "live") return true
  if (value === "0" || value === "false" || value === "pre") return false
  if (value === "start" || value === "go") return "start"
  if (value === "auto" || value === "null") return null
  return undefined
}

function readStoredLive(): LiveOverride {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw === "true") return true
    if (raw === "false") return false
    if (raw === "start") return "start"
  } catch {
    /* ignore */
  }
  return null
}

function persistLive(value: LiveOverride) {
  try {
    if (value === null) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    /* ignore */
  }
}

export function GameLiveOverrideProvider({ children }: { children: ReactNode }) {
  const enabled = isDevPreviewEnabled()
  const [liveOverride, setLiveOverrideState] = useState<LiveOverride>(null)
  const [simulatedNow, setSimulatedNow] = useState<number | null>(null)
  const [startReplayKey, setStartReplayKey] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setHydrated(true)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const fromQuery = parseLiveParam(params.get("live"))

    setLiveOverrideState(fromQuery !== undefined ? fromQuery : readStoredLive())
    setHydrated(true)
  }, [enabled])

  useEffect(() => {
    if (!enabled || !hydrated || liveOverride !== "start") {
      setSimulatedNow(null)
      return
    }

    const startAt = getGameStartDate().getTime()
    // Countdown shows 5…1, then holds 00:00:00 for one tick (still pre-game), then flips live.
    let remainingSec = START_PREVIEW_LEAD_SEC
    setSimulatedNow(startAt - remainingSec * 1000)

    const id = window.setInterval(() => {
      remainingSec -= 1
      if (remainingSec > 0) {
        setSimulatedNow(startAt - remainingSec * 1000)
      } else if (remainingSec === 0) {
        // 1ms before start → countdown floors to 00:00:00, isGameLive still false
        setSimulatedNow(startAt - 1)
      } else {
        setSimulatedNow(startAt)
        window.clearInterval(id)
      }
    }, 1000)

    return () => window.clearInterval(id)
  }, [enabled, hydrated, liveOverride, startReplayKey])

  const setLiveOverride = useCallback(
    (value: LiveOverride) => {
      if (!enabled) return
      setLiveOverrideState(value)
      persistLive(value)
      if (value === "start") {
        setStartReplayKey((key) => key + 1)
      }
    },
    [enabled],
  )

  const replayStartPreview = useCallback(() => {
    if (!enabled) return
    setLiveOverrideState("start")
    persistLive("start")
    setStartReplayKey((key) => key + 1)
  }, [enabled])

  const value = useMemo(
    () => ({
      liveOverride: enabled && hydrated ? liveOverride : null,
      setLiveOverride,
      replayStartPreview,
      simulatedNow: enabled && hydrated && liveOverride === "start" ? simulatedNow : null,
      enabled,
      hydrated: !enabled || hydrated,
    }),
    [
      enabled,
      hydrated,
      liveOverride,
      simulatedNow,
      setLiveOverride,
      replayStartPreview,
    ],
  )

  return (
    <GameLiveOverrideContext.Provider value={value}>{children}</GameLiveOverrideContext.Provider>
  )
}

export function useGameLiveOverride() {
  return useContext(GameLiveOverrideContext)
}

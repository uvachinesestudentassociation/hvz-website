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
import type { NightShiftHour } from "@/lib/game-start"

export type LiveOverride = boolean | null
export type NightOverride = NightShiftHour | null

type GameLiveOverrideContextValue = {
  /** null = follow real clock; true/false = force live / pre-game */
  liveOverride: LiveOverride
  setLiveOverride: (value: LiveOverride) => void
  /** null = derive from clock (or forced-live start); otherwise force night hour */
  nightOverride: NightOverride
  setNightOverride: (value: NightOverride) => void
  enabled: boolean
}

const STORAGE_KEY = "hvz-dev-game-live-override"
const NIGHT_STORAGE_KEY = "hvz-dev-night-override"

const GameLiveOverrideContext = createContext<GameLiveOverrideContextValue | null>(null)

function isDevPreviewEnabled() {
  return process.env.NODE_ENV === "development"
}

function parseLiveParam(value: string | null): LiveOverride | undefined {
  if (value === "1" || value === "true" || value === "live") return true
  if (value === "0" || value === "false" || value === "pre") return false
  if (value === "auto" || value === "null") return null
  return undefined
}

function parseNightParam(value: string | null): NightOverride | undefined {
  if (value === "12" || value === "3" || value === "6") {
    return Number(value) as NightShiftHour
  }
  if (value === "auto" || value === "null") return null
  return undefined
}

function readStoredLive(): LiveOverride {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw === "true") return true
    if (raw === "false") return false
  } catch {
    /* ignore */
  }
  return null
}

function readStoredNight(): NightOverride {
  try {
    const raw = sessionStorage.getItem(NIGHT_STORAGE_KEY)
    if (raw === "12" || raw === "3" || raw === "6") {
      return Number(raw) as NightShiftHour
    }
  } catch {
    /* ignore */
  }
  return null
}

export function GameLiveOverrideProvider({ children }: { children: ReactNode }) {
  const enabled = isDevPreviewEnabled()
  const [liveOverride, setLiveOverrideState] = useState<LiveOverride>(null)
  const [nightOverride, setNightOverrideState] = useState<NightOverride>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setHydrated(true)
      return
    }

    const params = new URLSearchParams(window.location.search)
    const fromQuery = parseLiveParam(params.get("live"))
    const nightFromQuery = parseNightParam(params.get("night"))

    setLiveOverrideState(fromQuery !== undefined ? fromQuery : readStoredLive())
    setNightOverrideState(nightFromQuery !== undefined ? nightFromQuery : readStoredNight())
    setHydrated(true)
  }, [enabled])

  const setLiveOverride = useCallback(
    (value: LiveOverride) => {
      if (!enabled) return
      setLiveOverrideState(value)
      try {
        if (value === null) sessionStorage.removeItem(STORAGE_KEY)
        else sessionStorage.setItem(STORAGE_KEY, String(value))
      } catch {
        /* ignore */
      }
    },
    [enabled],
  )

  const setNightOverride = useCallback(
    (value: NightOverride) => {
      if (!enabled) return
      setNightOverrideState(value)
      try {
        if (value === null) sessionStorage.removeItem(NIGHT_STORAGE_KEY)
        else sessionStorage.setItem(NIGHT_STORAGE_KEY, String(value))
      } catch {
        /* ignore */
      }
    },
    [enabled],
  )

  const value = useMemo(
    () => ({
      liveOverride: enabled && hydrated ? liveOverride : null,
      setLiveOverride,
      nightOverride: enabled && hydrated ? nightOverride : null,
      setNightOverride,
      enabled,
    }),
    [enabled, hydrated, liveOverride, nightOverride, setLiveOverride, setNightOverride],
  )

  return (
    <GameLiveOverrideContext.Provider value={value}>{children}</GameLiveOverrideContext.Provider>
  )
}

export function useGameLiveOverride() {
  return useContext(GameLiveOverrideContext)
}

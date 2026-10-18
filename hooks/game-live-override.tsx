"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  DUSK_FADE_MS,
  DUSK_NIGHT_LEAD_MS,
  duskAmount,
  getGameStartDate,
  getTimeUntilGameStart,
  hallLightsFlicker,
  isDuskNight,
} from "@/lib/game-start"

/** null = follow real clock; true/false = force live / pre-game; "start" = simulate T→0 flip */
export type LiveOverride = boolean | null | "start"

/** auto = clock. The other three are the hallway tube periods. */
export type HallPreview = "auto" | "off" | "on" | "flicker"

/** Seconds shown on the countdown before the simulated flip to live. */
const START_PREVIEW_LEAD_SEC = 5

/** Compressed dusk fade so the week-long dim can be watched in dev. 0 = real time. */
export function duskPreviewMs(speed: number): number {
  if (speed <= 0) return 0
  const t = Math.min(1, (speed - 1) / 99)
  return Math.round(90_000 - t * 85_000)
}

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
  /** 0 = real time. Higher plays the office dim faster. */
  duskSpeed: number
  setDuskSpeed: (speed: number) => void
  /** Dev preview of the hallway tubes. auto follows the clock. */
  hallPreview: HallPreview
  setHallPreview: (value: HallPreview) => void
  /** Theme branches. Fractional dusk is written to `--dusk` and does not live here. */
  night: boolean
  flicker: boolean
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
  const [duskSpeed, setDuskSpeedState] = useState(0)
  const [hallPreview, setHallPreviewState] = useState<HallPreview>("auto")
  const [duskPhase, setDuskPhase] = useState(() => ({
    night: isDuskNight(),
    flicker: hallLightsFlicker(),
  }))
  const duskProgress = useRef(0)
  const duskScrubRef = useRef<number | null>(null)
  const simulatedNowRef = useRef<number | null>(null)
  const duskSpeedRef = useRef(0)
  const cssDusk = useRef("")
  const duskPhaseRef = useRef(duskPhase)
  const [hydrated, setHydrated] = useState(false)

  simulatedNowRef.current = enabled && hydrated && liveOverride === "start" ? simulatedNow : null
  duskSpeedRef.current = enabled ? duskSpeed : 0
  duskPhaseRef.current = duskPhase

  const paintDusk = useCallback((clock: number) => {
    const night = isDuskNight(clock)
    const flicker = hallLightsFlicker(clock)
    const dusk = night ? 1 : duskAmount(clock)
    const css = dusk.toFixed(4)
    if (css !== cssDusk.current) {
      cssDusk.current = css
      document.documentElement.style.setProperty("--dusk", css)
    }
    if (duskPhaseRef.current.night === night && duskPhaseRef.current.flicker === flicker) return
    setDuskPhase({ night, flicker })
  }, [])

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

  useEffect(() => {
    if (!enabled || duskSpeed <= 0) {
      duskScrubRef.current = null
      if (duskSpeed <= 0) duskProgress.current = 0
      paintDusk(simulatedNowRef.current ?? Date.now())
      return
    }
    const startAt = getGameStartDate().getTime()
    const from = startAt - DUSK_FADE_MS
    const to = startAt - DUSK_NIGHT_LEAD_MS
    const duration = duskPreviewMs(duskSpeed)
    const startT = duskProgress.current >= 1 ? 0 : duskProgress.current
    const began = performance.now() - startT * duration
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / duration)
      duskProgress.current = t
      duskScrubRef.current = from + (to - from) * t
      paintDusk(duskScrubRef.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [enabled, duskSpeed, paintDusk])

  useEffect(() => {
    let timer = 0
    let stopped = false
    const tick = () => {
      if (stopped) return
      if (duskSpeedRef.current <= 0) paintDusk(simulatedNowRef.current ?? Date.now())
      const clock = duskScrubRef.current ?? simulatedNowRef.current ?? Date.now()
      const remaining = getTimeUntilGameStart(clock)
      let wait = 30_000
      if (duskSpeedRef.current > 0) wait = 500
      else if (remaining > DUSK_NIGHT_LEAD_MS && remaining < DUSK_FADE_MS) wait = 1000
      else if (remaining >= DUSK_FADE_MS) {
        wait = Math.min(30_000, Math.max(1000, remaining - DUSK_FADE_MS))
      }
      timer = window.setTimeout(tick, wait)
    }
    tick()
    return () => {
      stopped = true
      window.clearTimeout(timer)
    }
  }, [paintDusk])

  useEffect(() => {
    if (duskSpeedRef.current > 0) return
    paintDusk(simulatedNowRef.current ?? Date.now())
  }, [simulatedNow, liveOverride, hydrated, paintDusk])

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

  const setDuskSpeed = useCallback(
    (speed: number) => {
      if (!enabled) return
      setDuskSpeedState(Math.max(0, Math.min(100, speed)))
    },
    [enabled],
  )

  const setHallPreview = useCallback(
    (value: HallPreview) => {
      if (!enabled) return
      setHallPreviewState(value)
    },
    [enabled],
  )

  const value = useMemo(
    () => ({
      liveOverride: enabled && hydrated ? liveOverride : null,
      setLiveOverride,
      replayStartPreview,
      simulatedNow: enabled && hydrated && liveOverride === "start" ? simulatedNow : null,
      duskSpeed: enabled ? duskSpeed : 0,
      setDuskSpeed,
      hallPreview: enabled ? hallPreview : "auto",
      setHallPreview,
      night: duskPhase.night,
      flicker: duskPhase.flicker,
      enabled,
      hydrated: !enabled || hydrated,
    }),
    [
      enabled,
      hydrated,
      liveOverride,
      simulatedNow,
      duskPhase,
      duskSpeed,
      hallPreview,
      setDuskSpeed,
      setHallPreview,
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

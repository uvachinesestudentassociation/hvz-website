"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type GameStartCeremonyContextValue = {
  /** True while the resume ceremony overlay is playing. */
  playing: boolean
  /**
   * False until the ceremony finishes (or is skipped). Keeps useGameLive pre-game
   * for the whole T=0 → animation window — including the frame before `playing` flips.
   */
  liveRevealed: boolean
  setPlaying: (playing: boolean) => void
  markLiveRevealed: () => void
  clearLiveRevealed: () => void
  complete: () => void
}

const GameStartCeremonyContext = createContext<GameStartCeremonyContextValue | null>(null)

export function GameStartCeremonyProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false)
  // Default true so a hard-load on an already-live site doesn't flash pre-game UI.
  // Cleared when edge detection arms in pre-game.
  const [liveRevealed, setLiveRevealed] = useState(true)

  const markLiveRevealed = useCallback(() => setLiveRevealed(true), [])
  const clearLiveRevealed = useCallback(() => setLiveRevealed(false), [])

  const complete = useCallback(() => {
    // Overlay dismiss only — live UI should already be revealed under the scrim
    // during the exit beat. Keep setLiveRevealed as a safety net.
    setLiveRevealed(true)
    setPlaying(false)
  }, [])

  const value = useMemo(
    () => ({
      playing,
      liveRevealed,
      setPlaying,
      markLiveRevealed,
      clearLiveRevealed,
      complete,
    }),
    [playing, liveRevealed, complete, markLiveRevealed, clearLiveRevealed],
  )

  return (
    <GameStartCeremonyContext.Provider value={value}>{children}</GameStartCeremonyContext.Provider>
  )
}

export function useGameStartCeremony() {
  return useContext(GameStartCeremonyContext)
}

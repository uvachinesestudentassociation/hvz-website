"use client"

import { useGameLiveOverride } from "@/hooks/game-live-override"

/** Night and flicker only. The fractional fade is the `--dusk` custom property. */
export function useDusk() {
  const override = useGameLiveOverride()
  return {
    night: override?.night ?? false,
    flicker: override?.flicker ?? false,
  }
}

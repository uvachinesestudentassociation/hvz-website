import { isGameLive } from "@/lib/game-start"
import { THEME_GATE } from "@/lib/theme-gate-flag"

export function isSiteUnlocked(now = Date.now()): boolean {
  return !THEME_GATE.enabled || isGameLive(now)
}

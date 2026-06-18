import { isGameLive } from "@/lib/game-start"

/**
 * Theme reveal gate — blocks the site until game start unless an exec enters the preview code.
 * The code lives in EXEC_PREVIEW_CODE (.env.local, gitignored) and is checked server-side.
 * Set `enabled` to false after game week if desired.
 */
export const THEME_GATE = {
  enabled: true,
} as const

export function isSiteUnlocked(now = Date.now()): boolean {
  return !THEME_GATE.enabled || isGameLive(now)
}

import { cookies } from "next/headers"
import { isGameLive } from "@/lib/game-start"
import { PREVIEW_COOKIE, previewCookieMatches } from "@/lib/preview-cookie"
import { SITE_CONFIG } from "@/lib/site-config"
import { THEME_GATE } from "@/lib/theme-gate-flag"

export { THEME_GATE }

export function isSiteUnlocked(now = Date.now()): boolean {
  return !THEME_GATE.enabled || isGameLive(now)
}

export async function isRequestUnlocked(now = Date.now()): Promise<boolean> {
  if (!THEME_GATE.enabled || isGameLive(now)) return true
  const secret = process.env.EXEC_PREVIEW_CODE
  if (!secret) return false
  const jar = await cookies()
  return previewCookieMatches(jar.get(PREVIEW_COOKIE)?.value, secret, SITE_CONFIG.gameYear)
}

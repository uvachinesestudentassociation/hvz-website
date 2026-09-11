import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { getGameEndDate } from "@/lib/game-start"
import { PREVIEW_COOKIE, previewCookieMessage } from "@/lib/preview-cookie-message"

export { PREVIEW_COOKIE }

const ONE_DAY_SEC = 60 * 60 * 24

export function previewCookieValue(secret: string, gameYear: number): string {
  return createHmac("sha256", secret).update(previewCookieMessage(gameYear)).digest("base64url")
}

export function previewCookieMatches(
  cookieValue: string | undefined,
  secret: string,
  gameYear: number,
): boolean {
  if (!cookieValue || !secret) return false
  const expected = Buffer.from(previewCookieValue(secret, gameYear))
  const got = Buffer.from(cookieValue)
  if (expected.length !== got.length) return false
  return timingSafeEqual(expected, got)
}

export function codesMatch(input: string, secret: string): boolean {
  const a = createHash("sha256").update(input.trim().toUpperCase()).digest()
  const b = createHash("sha256").update(secret.trim().toUpperCase()).digest()
  return timingSafeEqual(a, b)
}

/** Seconds until game end, at least one day, so a September unlock lasts through the week. */
export function previewCookieMaxAge(now = Date.now()): number {
  const remainingSec = Math.ceil((getGameEndDate().getTime() - now) / 1000)
  return Math.max(ONE_DAY_SEC, remainingSec)
}

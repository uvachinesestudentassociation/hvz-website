import { PREVIEW_COOKIE, previewCookieMessage } from "@/lib/preview-cookie-message"

export { PREVIEW_COOKIE }

function toBase64Url(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes)
  let binary = ""
  for (const byte of view) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}

async function sign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))
  return toBase64Url(signature)
}

/** Edge-safe twin of previewCookieMatches. Must stay equal to the node HMAC. */
export async function previewCookieMatchesEdge(
  cookieValue: string | undefined,
  secret: string,
  gameYear: number,
): Promise<boolean> {
  if (!cookieValue || !secret) return false
  const expected = await sign(secret, previewCookieMessage(gameYear))
  if (expected.length !== cookieValue.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ cookieValue.charCodeAt(i)
  }
  return mismatch === 0
}

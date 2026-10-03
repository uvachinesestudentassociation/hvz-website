export const PREVIEW_COOKIE = "hvz-exec-preview"

export function previewCookieMessage(gameYear: number): string {
  return `hvz-exec-preview:${gameYear}`
}

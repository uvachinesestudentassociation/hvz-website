import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isGameLive } from "@/lib/game-start"
import { PREVIEW_COOKIE, previewCookieMatchesEdge } from "@/lib/preview-cookie-edge"
import { SITE_CONFIG } from "@/lib/site-config"
import { THEME_GATE } from "@/lib/theme-gate-flag"

async function isUnlocked(request: NextRequest): Promise<boolean> {
  if (!THEME_GATE.enabled || isGameLive()) return true
  const secret = process.env.EXEC_PREVIEW_CODE
  if (!secret) return false
  return previewCookieMatchesEdge(
    request.cookies.get(PREVIEW_COOKIE)?.value,
    secret,
    SITE_CONFIG.gameYear,
  )
}

export async function middleware(request: NextRequest) {
  if (await isUnlocked(request)) return NextResponse.next()
  if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.next()
  if (request.nextUrl.pathname === "/locked") return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/locked"
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}

import { NextResponse } from "next/server"
import {
  PREVIEW_COOKIE,
  codesMatch,
  previewCookieMaxAge,
  previewCookieValue,
} from "@/lib/preview-cookie"
import { SITE_CONFIG } from "@/lib/site-config"
import { THEME_GATE } from "@/lib/theme-gate"

const WINDOW_MS = 10 * 60 * 1000
const MAX_MISMATCHES = 8

type FailureWindow = { count: number; resetAt: number }

// ponytail: per-instance only on serverless; upgrade path is a shared store
const failures = new Map<string, FailureWindow>()

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const first = forwarded?.split(",")[0]?.trim()
  return first || "unknown"
}

function isLimited(key: string, now = Date.now()): boolean {
  const entry = failures.get(key)
  if (!entry || now >= entry.resetAt) return false
  return entry.count >= MAX_MISMATCHES
}

function recordMismatch(key: string, now = Date.now()) {
  const entry = failures.get(key)
  if (!entry || now >= entry.resetAt) {
    failures.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  entry.count += 1
}

export async function POST(request: Request) {
  if (!THEME_GATE.enabled) {
    return NextResponse.json({ ok: true })
  }

  const secret = process.env.EXEC_PREVIEW_CODE
  if (!secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 })
  }

  const key = clientKey(request)
  if (isLimited(key)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const code = typeof body === "object" && body !== null && "code" in body ? body.code : undefined
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (!codesMatch(code, secret)) {
    recordMismatch(key)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(PREVIEW_COOKIE, previewCookieValue(secret, SITE_CONFIG.gameYear), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: previewCookieMaxAge(),
  })
  return response
}

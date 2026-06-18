import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { THEME_GATE } from "@/lib/theme-gate"

function codesMatch(input: string, secret: string): boolean {
  const a = Buffer.from(input.trim().toUpperCase())
  const b = Buffer.from(secret.trim().toUpperCase())
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!THEME_GATE.enabled) {
    return NextResponse.json({ ok: true })
  }

  const secret = process.env.EXEC_PREVIEW_CODE
  if (!secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 })
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
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}

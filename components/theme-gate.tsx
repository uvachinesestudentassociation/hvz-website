"use client"

import { FormEvent, useEffect, useState } from "react"
import { getGameStartLabel, getTimeUntilGameStart } from "@/lib/game-start"
import { SITE_CONFIG } from "@/lib/site-config"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function parseTimeLeft(ms: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="min-w-[3.5rem] border border-zinc-700 bg-zinc-900 px-2 py-3 font-mono text-2xl font-semibold tabular-nums text-zinc-100 md:min-w-[4.5rem] md:text-3xl">
        {value.toString().padStart(2, "0")}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</span>
    </div>
  )
}

type ThemeGateProps = {
  onUnlock: () => void
}

export function ThemeGate({ onUnlock }: ThemeGateProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState<"invalid" | "unavailable" | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const tick = () => setTimeLeft(parseTimeLeft(getTimeUntilGameStart()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/exec-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        const data = (await response.json()) as { ok?: boolean }
        if (data.ok) {
          onUnlock()
          return
        }
      }

      if (response.status === 503) {
        setError("unavailable")
        return
      }

      setError("invalid")
    } catch {
      setError("unavailable")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 px-4 py-8 text-zinc-100"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-gate-title"
    >
      <div className="w-full max-w-lg border border-zinc-800 bg-zinc-900 p-6 shadow-2xl md:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          {`Humans vs. Zombies ${SITE_CONFIG.gameYear}`}
        </p>
        <h1 id="theme-gate-title" className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Site locked until game start
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This year&apos;s site theme stays hidden until the game begins so nothing is spoiled early.
        </p>

        {timeLeft && (
          <div className="mt-8">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">Unlocks in</p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <span className="pb-5 font-mono text-xl text-zinc-600">:</span>
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <span className="pb-5 font-mono text-xl text-zinc-600">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <span className="pb-5 font-mono text-xl text-zinc-600">:</span>
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>
            <p className="mt-4 text-center font-mono text-xs text-zinc-500">{getGameStartLabel()}</p>
          </div>
        )}

        <form className="mt-8 border-t border-zinc-800 pt-6" onSubmit={handleSubmit}>
          <label htmlFor="exec-preview-code" className="block font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
            Exec preview code
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="exec-preview-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                if (error) setError(null)
              }}
              placeholder="Enter code"
              className={[
                "min-w-0 flex-1 border bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none",
                error ? "border-red-500" : "border-zinc-700 focus:border-zinc-500",
              ].join(" ")}
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="border border-zinc-600 bg-zinc-800 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-zinc-100 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Checking…" : "Unlock"}
            </button>
          </div>
          {error === "invalid" && (
            <p className="mt-2 font-mono text-xs text-red-400" role="alert">
              Invalid code. Try again or wait for game start.
            </p>
          )}
          {error === "unavailable" && (
            <p className="mt-2 font-mono text-xs text-red-400" role="alert">
              Preview unlock is not available right now.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

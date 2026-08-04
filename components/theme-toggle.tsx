"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { animate, utils } from "animejs"
import { DESK, OFFICE, THEME } from "@/content/theme"
import { PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles"

const REDUCED_MQ = "(prefers-reduced-motion: reduce)"
const TOGGLE_MS = 320

function useThemeState() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !resolvedTheme) return
    setIsDark(resolvedTheme === "dark")
  }, [mounted, resolvedTheme])

  return { mounted, isDark, setTheme, setIsDark }
}

export function ThemeToggle() {
  const { mounted, isDark, setTheme, setIsDark } = useThemeState()
  const trackRef = useRef<HTMLButtonElement>(null)
  const knobRef = useRef<HTMLSpanElement>(null)
  const sunRef = useRef<HTMLSpanElement>(null)
  const moonRef = useRef<HTMLSpanElement>(null)
  const prevDark = useRef<boolean | null>(null)

  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  useEffect(() => {
    const track = trackRef.current
    const knob = knobRef.current
    const sun = sunRef.current
    const moon = moonRef.current
    if (!mounted || !track || !knob || !sun || !moon) return

    const reduced = window.matchMedia(REDUCED_MQ).matches
    const duration = reduced || prevDark.current === null ? 0 : TOGGLE_MS

    const trackColors = {
      borderColor: isDark ? DESK.border : OFFICE.border,
      backgroundColor: isDark ? DESK.wood : OFFICE.laminate,
    }
    const knobColors = {
      borderColor: isDark ? DESK.border : OFFICE.border,
      backgroundColor: isDark ? DESK.paper : OFFICE.paper,
    }

    if (duration === 0) {
      utils.set(track, trackColors)
      utils.set(knob, { ...knobColors, x: isDark ? "100%" : "0%" })
      utils.set(sun, {
        opacity: isDark ? 0.35 : 1,
        color: isDark ? DESK.textMuted : OFFICE.textMuted,
      })
      utils.set(moon, {
        opacity: isDark ? 1 : 0.35,
        color: isDark ? "#fbbf24" : OFFICE.text,
      })
    } else {
      animate(track, { ...trackColors, duration, ease: "inOutQuad" })
      animate(knob, {
        ...knobColors,
        x: isDark ? "100%" : "0%",
        duration,
        ease: "inOutQuad",
      })
      animate(sun, {
        opacity: isDark ? 0.35 : 1,
        color: isDark ? DESK.textMuted : OFFICE.textMuted,
        duration,
        ease: "inOutQuad",
      })
      animate(moon, {
        opacity: isDark ? 1 : 0.35,
        color: isDark ? "#fbbf24" : OFFICE.text,
        duration,
        ease: "inOutQuad",
      })
    }

    prevDark.current = isDark
  }, [isDark, mounted])

  const handleToggle = () => {
    const next = !isDark
    setIsDark(next)
    setTheme(next ? "dark" : "light")
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full z-30 hidden pt-3 md:block">
      <div className="container mx-auto flex justify-end px-4">
        <button
          ref={trackRef}
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={label}
          disabled={!mounted}
          onClick={handleToggle}
          className={[
            "theme-toggle pointer-events-auto relative h-12 w-[6.5rem] shrink-0 overflow-hidden rounded-none border-[3px] p-1",
            "shadow-[3px_3px_0_rgba(0,0,0,0.35)]",
            "focus-visible:outline-none focus-visible:ring-4",
            THEME.accent.ring,
            "active:translate-x-[1px] active:translate-y-[1px]",
            !mounted && "pointer-events-none opacity-0",
          ].join(" ")}
          style={{
            boxShadow: isDark
              ? "3px 3px 0 rgba(0,0,0,0.55)"
              : "3px 3px 0 rgba(0,0,0,0.35)",
          }}
        >
          <span className="absolute inset-1" aria-hidden="true">
            <span className="relative z-10 grid h-full grid-cols-2">
              <span ref={sunRef} className="flex items-center justify-center">
                <Sun className="h-5 w-5" aria-hidden="true" />
              </span>
              <span ref={moonRef} className="flex items-center justify-center">
                <Moon className="h-5 w-5" aria-hidden="true" />
              </span>
            </span>

            <span
              ref={knobRef}
              className="absolute inset-y-0 left-0 w-1/2 rounded-none border-[3px]"
              style={{
                boxShadow: isDark
                  ? "2px 2px 0 rgba(0,0,0,0.55)"
                  : "2px 2px 0 rgba(0,0,0,0.2)",
              }}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

export function MobileThemeToggle() {
  const { mounted, isDark, setTheme } = useThemeState()
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <button
      type="button"
      aria-label={label}
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        `flex h-12 w-12 items-center justify-center rounded-none border-4 ${PIXEL_SECTION_BORDER}`,
        "bg-[#f0ebe3] dark:bg-[#2a2420]",
        "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)]",
        "active:translate-x-[1px] active:translate-y-[1px]",
        "touch-manipulation",
        !mounted && "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-300" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-[#5c4a38] dark:text-purple-300" aria-hidden="true" />
      )}
    </button>
  )
}

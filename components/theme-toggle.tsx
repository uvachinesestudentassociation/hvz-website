"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles"

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
  const themeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (themeTimeoutRef.current !== null) {
        window.clearTimeout(themeTimeoutRef.current)
      }
    }
  }, [])

  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  const handleToggle = () => {
    const next = !isDark
    setIsDark(next)

    if (themeTimeoutRef.current !== null) {
      window.clearTimeout(themeTimeoutRef.current)
    }

    themeTimeoutRef.current = window.setTimeout(() => {
      setTheme(next ? "dark" : "light")
      themeTimeoutRef.current = null
    }, 320)
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full z-30 hidden pt-3 md:block">
      <div className="container mx-auto flex justify-end px-4">
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={label}
          disabled={!mounted}
          onClick={handleToggle}
          className={[
            "theme-toggle pointer-events-auto relative h-12 w-[6.5rem] shrink-0 overflow-hidden rounded-none border-[3px] p-1",
            "shadow-[3px_3px_0_rgba(0,0,0,0.35)]",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60",
            "active:translate-x-[1px] active:translate-y-[1px]",
            !mounted && "pointer-events-none opacity-0",
          ].join(" ")}
          style={{
            borderColor: isDark ? "#d4d4d4" : "#171717",
            backgroundColor: isDark ? "#1e1b4b" : "#7dd3fc",
            boxShadow: isDark
              ? "3px 3px 0 rgba(255,255,255,0.06)"
              : "3px 3px 0 rgba(0,0,0,0.35)",
            transition:
              "background-color 320ms ease-in-out, border-color 320ms ease-in-out, box-shadow 320ms ease-in-out",
          }}
        >
          <span className="absolute inset-1" aria-hidden="true">
            <span className="relative z-10 grid h-full grid-cols-2">
              <span className="flex items-center justify-center">
                <Sun
                  className="h-5 w-5"
                  style={{
                    color: isDark ? "#fde68a" : "#d97706",
                    opacity: isDark ? 0.35 : 1,
                    transition: "opacity 320ms ease-in-out, color 320ms ease-in-out",
                  }}
                  aria-hidden="true"
                />
              </span>
              <span className="flex items-center justify-center">
                <Moon
                  className="h-5 w-5"
                  style={{
                    color: isDark ? "#e0f2fe" : "#3730a3",
                    opacity: isDark ? 1 : 0.35,
                    transition: "opacity 320ms ease-in-out, color 320ms ease-in-out",
                  }}
                  aria-hidden="true"
                />
              </span>
            </span>

            <span
              className="absolute inset-y-0 left-0 w-1/2 rounded-none border-[3px]"
              style={{
                borderColor: isDark ? "#d4d4d4" : "#171717",
                backgroundColor: isDark ? "#262626" : "#ffffff",
                boxShadow: isDark
                  ? "2px 2px 0 rgba(255,255,255,0.08)"
                  : "2px 2px 0 rgba(0,0,0,0.2)",
                transform: isDark ? "translateX(100%)" : "translateX(0)",
                transition:
                  "transform 320ms ease-in-out, background-color 320ms ease-in-out, border-color 320ms ease-in-out, box-shadow 320ms ease-in-out",
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
        "bg-white dark:bg-neutral-900",
        "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)]",
        "active:translate-x-[1px] active:translate-y-[1px]",
        "touch-manipulation",
        !mounted && "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
      )}
    </button>
  )
}

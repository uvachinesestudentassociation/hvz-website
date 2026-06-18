"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { PIXEL_SECTION_BORDER, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { THEME, THEME_COPY } from "@/content/theme"
import { HEADS_UP_ITEMS } from "@/content/heads-up"

export function HeadsUpBanner() {
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    setVisible(false)
  }

  if (!visible) return null

  const { headsUp } = THEME_COPY

  return (
    <div
      id="heads-up"
      className={[
        `border-b-4 ${PIXEL_SECTION_BORDER} ${THEME.alarm.border}`,
        "scroll-mt-24",
        "pt-[env(safe-area-inset-top)] md:pt-0",
      ].join(" ")}
    >
      <div
        className={[
          "border-b-4 border-[#8b1a1a] bg-[#c41e1e] px-4 py-2",
          "dark:border-[#5c1515] dark:bg-[#3a1818]",
        ].join(" ")}
      >
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertTriangle
            className="size-4 shrink-0 text-[#fff8e0] opacity-90"
            aria-hidden="true"
          />
          <p className="heads-up__headline">{headsUp.title}</p>
        </div>
      </div>

      <div className={`relative ${THEME.alarm.bgLight}`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
          aria-hidden="true"
        />

        <div className="container relative mx-auto flex gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 font-mono text-sm break-words">
            <ul className={`list-none space-y-1 ${PIXEL_TEXT} dark:text-[#e8dfd0]`}>
              {HEADS_UP_ITEMS.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className={`shrink-0 font-bold ${THEME.alarm.text} dark:text-amber-400/90`} aria-hidden="true">
                    ›
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className={`mt-2 text-xs font-bold uppercase tracking-wide ${PIXEL_TEXT_MUTED} dark:text-[#a89580]`}>
              {headsUp.footer}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss heads up banner"
            className={`shrink-0 self-start p-2 ${PIXEL_TEXT_MUTED} hover:text-[#3c3228] dark:text-[#a89580] dark:hover:text-[#e8dfd0]`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

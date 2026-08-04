"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { AlertTriangle, X } from "lucide-react"
import { PIXEL_SECTION_BORDER, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { THEME, THEME_COPY } from "@/content/theme"
import { HEADS_UP_ITEMS } from "@/content/heads-up"

function HeadsUpList() {
  const { headsUp } = THEME_COPY

  return (
    <>
      <ul className={`list-none space-y-1 ${PIXEL_TEXT} dark:text-[#e8dfd0]`}>
        {HEADS_UP_ITEMS.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              className={`shrink-0 font-bold ${THEME.alarm.text} dark:text-amber-400/90`}
              aria-hidden="true"
            >
              ›
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p
        className={`mt-2 text-xs font-bold uppercase tracking-wide ${PIXEL_TEXT_MUTED} dark:text-[#a89580]`}
      >
        {headsUp.footer}
      </p>
    </>
  )
}

function AlarmStripe() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.1]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
      }}
      aria-hidden="true"
    />
  )
}

function PriorityHeader() {
  const { headsUp } = THEME_COPY

  return (
    <div
      className={[
        "border-b-4 border-[#8b1a1a] bg-[#c41e1e] px-4 py-2",
        "dark:border-[#5c1515] dark:bg-[#3a1818]",
      ].join(" ")}
    >
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle
          className="size-4 shrink-0 text-[#fff8e0] opacity-90"
          aria-hidden="true"
        />
        <p className="heads-up__headline">{headsUp.title}</p>
      </div>
    </div>
  )
}

export function HeadsUpBanner() {
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!visible || !isMobile) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [visible, isMobile])

  const dismiss = () => {
    setVisible(false)
  }

  if (!visible || isMobile === null) return null

  if (isMobile) {
    return createPortal(
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="heads-up-mobile-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/55"
          aria-label="Dismiss priority alert"
          onClick={dismiss}
        />
        <div
          id="heads-up"
          className={[
            "relative z-10 max-h-[min(85dvh,36rem)] w-full max-w-md overflow-y-auto",
            `border-4 ${PIXEL_SECTION_BORDER} ${THEME.alarm.border}`,
            "shadow-[6px_6px_0_rgba(0,0,0,0.55)]",
            "scroll-mt-24",
          ].join(" ")}
        >
          <div className="sticky top-0 z-10">
            <PriorityHeader />
            <h2 id="heads-up-mobile-title" className="sr-only">
              {THEME_COPY.headsUp.title}
            </h2>
          </div>

          <div className={`relative ${THEME.alarm.bgLight}`}>
            <AlarmStripe />
            <div className="relative flex gap-3 px-4 py-3 font-mono text-sm break-words">
              <div className="min-w-0 flex-1">
                <HeadsUpList />
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
      </div>,
      document.body,
    )
  }

  return (
    <div
      id="heads-up"
      className={[
        `border-b-4 ${PIXEL_SECTION_BORDER} ${THEME.alarm.border}`,
        "scroll-mt-24",
      ].join(" ")}
    >
      <PriorityHeader />

      <div className={`relative ${THEME.alarm.bgLight}`}>
        <AlarmStripe />

        <div className="container relative mx-auto flex gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 font-mono text-sm break-words">
            <HeadsUpList />
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

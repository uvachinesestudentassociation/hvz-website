"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { PIXEL_SECTION_BORDER, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"
import { HEADS_UP_FOOTER, HEADS_UP_ITEMS } from "@/content/heads-up"

export function HeadsUpBanner() {
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      id="heads-up"
      className={[
        `border-b-4 ${PIXEL_SECTION_BORDER} ${THEME.alarm.bgLight}`,
        "pt-[env(safe-area-inset-top)] md:pt-0",
        "scroll-mt-24",
      ].join(" ")}
    >
      <div className="container mx-auto flex gap-3 px-4 py-3">
        <div className="min-w-0 flex-1 font-mono text-sm break-words">
          <p className={`font-bold ${THEME.alarm.textStrong} dark:text-amber-200`}>Heads up! Latest rule tweaks:</p>
          <ul className={`mt-1 list-disc space-y-0.5 pl-4 ${PIXEL_TEXT} dark:text-[#e8dfd0]`}>
            {HEADS_UP_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={`mt-1 text-xs ${PIXEL_TEXT_MUTED} dark:text-[#a89580]`}>{HEADS_UP_FOOTER}</p>
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
  )
}

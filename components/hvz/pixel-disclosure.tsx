"use client"

import type React from "react"
import { useEffect, useId, useRef, useState } from "react"
import { animate, utils } from "animejs"
import { CardContent, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { PIXEL_FRAME, RULE_BODY_CLASS, PIXEL_SECTION_BORDER, PIXEL_TEXT } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"

const REDUCED_MQ = "(prefers-reduced-motion: reduce)"

export type PixelDisclosureProps = {
  id?: string
  title: React.ReactNode
  children: React.ReactNode
  headerTone?: "emerald" | "sky" | "amber" | "rose"
  defaultOpen?: boolean
  className?: string
}

export function PixelDisclosure({
  id,
  title,
  children,
  headerTone = "emerald",
  defaultOpen = false,
  className = "",
}: PixelDisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)
  const autoId = useId()
  const panelId = id ? `${id}-panel` : autoId
  const chevronRef = useRef<HTMLSpanElement>(null)
  const prevOpen = useRef<boolean | null>(null)

  useEffect(() => {
    const chevron = chevronRef.current
    if (!chevron) return

    const reduced = window.matchMedia(REDUCED_MQ).matches
    const duration = reduced || prevOpen.current === null ? 0 : 220
    const rotate = open ? 180 : 0

    if (duration === 0) {
      utils.set(chevron, { rotate })
    } else {
      animate(chevron, { rotate, duration, ease: "outQuad" })
    }

    prevOpen.current = open
  }, [open])

  const toneBg: Record<string, string> = {
    emerald: "bg-[#e8dcc8]/60 dark:bg-[#2a2420]/80",
    sky: "bg-[#f5f0e6]/80 dark:bg-[#2a2420]/80",
    amber: "bg-amber-100/60 dark:bg-[#2a2218]/80",
    rose: "bg-red-100/60 dark:bg-[#2a2018]/80",
  }

  return (
    <div id={id} className={[PIXEL_FRAME, "scroll-mt-24", className].join(" ")}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex w-full min-h-[48px] items-center justify-between px-4 py-4 md:px-6",
          `rounded-none border-b-4 ${PIXEL_SECTION_BORDER} hover:no-underline`,
          toneBg[headerTone],
          "focus:outline-none focus-visible:ring-4",
          THEME.accent.ring,
        ].join(" ")}
      >
        <span className="text-left">
          <CardTitle className={`font-mono text-xl md:text-2xl ${THEME.accent.link}`}>{title}</CardTitle>
        </span>
        <span ref={chevronRef} className={`inline-flex shrink-0 ${PIXEL_TEXT}`}>
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      <div id={panelId} hidden={!open}>
        <CardContent className={`p-4 md:p-8 space-y-4 ${RULE_BODY_CLASS}`}>{children}</CardContent>
      </div>
    </div>
  )
}

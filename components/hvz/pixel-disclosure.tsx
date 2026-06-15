"use client"

import type React from "react"
import { useId, useState } from "react"
import { CardContent, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { PIXEL_FRAME, RULE_BODY_CLASS, PIXEL_SECTION_BORDER, PIXEL_TEXT } from "@/components/hvz/pixel-styles"

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

  const toneBg: Record<string, string> = {
    emerald: "bg-emerald-500/20",
    sky: "bg-sky-500/20",
    amber: "bg-amber-500/20",
    rose: "bg-rose-500/20",
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
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/60",
        ].join(" ")}
      >
        <span className="text-left">
          <CardTitle className="font-mono text-xl md:text-2xl text-emerald-700 dark:text-emerald-400">{title}</CardTitle>
        </span>
        <ChevronDown
          className={[
            `h-5 w-5 shrink-0 ${PIXEL_TEXT} transition-transform`,
            open ? "rotate-180" : "rotate-0",
          ].join(" ")}
          aria-hidden="true"
        />
      </button>

      <div id={panelId} hidden={!open}>
        <CardContent className={`p-4 md:p-8 space-y-4 ${RULE_BODY_CLASS}`}>{children}</CardContent>
      </div>
    </div>
  )
}

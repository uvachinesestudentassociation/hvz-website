import type React from "react"
import { CardContent, CardTitle } from "@/components/ui/card"
import { RULE_BODY_CLASS, PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles"

export function BlockPanel({
  title,
  tone = "primary",
  className = "",
  children,
}: {
  title?: React.ReactNode
  tone?: "primary" | "danger" | "stone"
  className?: string
  children: React.ReactNode
}) {
  const toneMap: Record<string, string> = {
    primary: "border-emerald-600 bg-emerald-500/10",
    danger: "border-rose-600 bg-rose-500/10",
    stone: "border-stone-600 bg-stone-500/10",
  }

  return (
    <div
      className={[
        "rounded-none border-4",
        toneMap[tone],
        "shadow-[8px_8px_0_rgba(0,0,0,0.4)]",
        "overflow-hidden [background-clip:padding-box]",
        className,
      ].join(" ")}
    >
      {title && (
        <div className={`rounded-none border-b-4 ${PIXEL_SECTION_BORDER} bg-black/10 dark:bg-white/10 px-4 py-3 [background-clip:padding-box]`}>
          <CardTitle className="font-mono text-xl md:text-2xl tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {title}
          </CardTitle>
        </div>
      )}
      <CardContent className={`rounded-none pt-6 ${RULE_BODY_CLASS}`}>{children}</CardContent>
    </div>
  )
}

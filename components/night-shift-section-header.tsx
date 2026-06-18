"use client"

import type { ReactNode } from "react"
import { THEME_COPY } from "@/content/theme"
import { PIXEL_TEXT, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import { useNightShift } from "@/hooks/use-night-shift"

type NightShiftSectionHeaderProps = {
  children: ReactNode
  as?: "h2" | "h3"
  className?: string
  showNightWhenLive?: boolean
}

export function NightShiftSectionHeader({
  children,
  as: Tag = "h2",
  className = "",
  showNightWhenLive = false,
}: NightShiftSectionHeaderProps) {
  const nightHour = useNightShift()
  const textClass = Tag === "h2" ? PIXEL_TEXT : PIXEL_TEXT_SUBTLE
  const sizeClass =
    Tag === "h2"
      ? "text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider"
      : "text-center font-mono text-sm font-bold uppercase tracking-wider"

  if (showNightWhenLive && nightHour !== null) {
    return (
      <Tag className={`mb-4 ${sizeClass} ${textClass} ${className}`}>
        {THEME_COPY.nightCheckIn(nightHour)}
      </Tag>
    )
  }

  return (
    <Tag className={`${Tag === "h2" ? "mb-4" : "mb-4"} ${sizeClass} ${textClass} ${className}`}>
      {children}
    </Tag>
  )
}

import type { ReactNode } from "react"
import { PIXEL_TEXT, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"

type NightShiftSectionHeaderProps = {
  children: ReactNode
  as?: "h2" | "h3"
  className?: string
}

export function NightShiftSectionHeader({
  children,
  as: Tag = "h2",
  className = "",
}: NightShiftSectionHeaderProps) {
  const textClass = Tag === "h2" ? PIXEL_TEXT : PIXEL_TEXT_SUBTLE
  const sizeClass =
    Tag === "h2"
      ? "text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider"
      : "text-center font-mono text-sm font-bold uppercase tracking-wider"

  return (
    <Tag className={`mb-4 ${sizeClass} ${textClass} ${className}`}>
      {children}
    </Tag>
  )
}

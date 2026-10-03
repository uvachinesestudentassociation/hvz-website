import type { ReactNode } from "react"
import { PIXEL_TEXT } from "@/components/hvz/pixel-styles"

export function NightShiftSectionHeader({ children }: { children: ReactNode }) {
  return (
    <h2
      className={`mb-4 text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-balance ${PIXEL_TEXT}`}
    >
      {children}
    </h2>
  )
}

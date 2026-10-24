import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
}

/** Mobile homepage blocks. Rendered visible immediately; no fade-in. */
export function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={cn(className)}>{children}</div>
}

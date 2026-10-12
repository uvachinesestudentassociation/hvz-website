"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { useDusk } from "@/hooks/use-dusk"

export function DuskTheme({ children }: { children: ReactNode }) {
  const { night } = useDusk()

  return (
    <ThemeProvider attribute="class" forcedTheme={night ? "dark" : "light"} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

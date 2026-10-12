"use client"

import { useEffect, type ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { useDusk } from "@/hooks/use-dusk"

export function DuskTheme({ children }: { children: ReactNode }) {
  const { amount, night } = useDusk()
  const dusk = night ? 1 : amount

  useEffect(() => {
    document.documentElement.style.setProperty("--dusk", dusk.toFixed(4))
  }, [dusk])

  return (
    <ThemeProvider attribute="class" forcedTheme={night ? "dark" : "light"} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

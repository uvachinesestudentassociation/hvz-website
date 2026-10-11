"use client"

import { useEffect, useState, type ReactNode } from "react"
import dynamic from "next/dynamic"

const LabDesk = dynamic(() => import("@/components/lab-desk").then((mod) => mod.LabDesk), {
  ssr: false,
})

const DESK_MQ = "(min-width: 768px)"

export function LabDeskLoader({ children }: { children: ReactNode }) {
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(DESK_MQ)
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  if (!desktop) return children
  return <LabDesk />
}

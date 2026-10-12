"use client"

import dynamic from "next/dynamic"

const LabDesk = dynamic(() => import("@/components/lab-desk").then((mod) => mod.LabDesk), {
  ssr: false,
})

export function LabDeskLoader() {
  return <LabDesk />
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LabDeskLoader } from "@/components/lab-desk-loader"
import HomePage from "../page"

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
}

export default function LabPage() {
  if (process.env.NODE_ENV !== "development") notFound()

  return (
    <LabDeskLoader>
      <HomePage />
    </LabDeskLoader>
  )
}

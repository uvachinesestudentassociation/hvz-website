import type { Metadata } from "next"
import { cookies } from "next/headers"
import { LabDeskLoader } from "@/components/lab-desk-loader"
import { LabPassword } from "@/components/lab-password"
import HomePage from "../page"
import { PREVIEW_COOKIE, previewCookieMatches } from "@/lib/preview-cookie"
import { SITE_CONFIG } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
}

export default async function LabPage() {
  if (process.env.NODE_ENV !== "development") {
    const secret = process.env.EXEC_PREVIEW_CODE
    const jar = await cookies()
    const open =
      !!secret &&
      previewCookieMatches(jar.get(PREVIEW_COOKIE)?.value, secret, SITE_CONFIG.gameYear)
    if (!open) return <LabPassword />
  }

  return (
    <LabDeskLoader>
      <HomePage />
    </LabDeskLoader>
  )
}

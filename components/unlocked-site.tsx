import { SiteShell } from "@/components/site-shell"
import "@/app/themes/index.css"

export function UnlockedSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <SiteShell>{children}</SiteShell>
    </>
  )
}

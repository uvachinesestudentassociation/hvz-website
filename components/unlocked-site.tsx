import { Analytics } from "@vercel/analytics/next"
import { SiteShell } from "@/components/site-shell"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/themes/index.css"

export function UnlockedSite({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <a href="#main-content" className="sr-only">
        Skip to main content
      </a>
      <SiteShell>{children}</SiteShell>
      <Analytics />
    </ThemeProvider>
  )
}

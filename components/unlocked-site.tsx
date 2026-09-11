import { Analytics } from "@vercel/analytics/next"
import { SiteShell } from "@/components/site-shell"
import { ThemeProvider } from "@/components/theme-provider"
import { ACTIVE_THEME_ID } from "@/content/theme"
import "@/app/themes/index.css"

export { ACTIVE_THEME_ID }

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

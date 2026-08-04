"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp } from "lucide-react"
import { GameLiveDevPanel } from "@/components/game-live-dev-panel"
import { HeadsUpBanner } from "@/components/heads-up-banner"
import { DesktopSiteNav, MobileSiteNav } from "@/components/site-nav"
import { ThemeGate } from "@/components/theme-gate"
import { ThemeToggle } from "@/components/theme-toggle"
import { PIXEL_FRAME, PIXEL_GRID_BG, PIXEL_SECTION_BORDER, PIXEL_SECTION_PRIMARY, PIXEL_TEXT_MUTED, DESK_RING } from "@/components/hvz/pixel-styles"
import { GameLiveOverrideProvider } from "@/hooks/game-live-override"
import { useThemeGate } from "@/hooks/use-theme-gate"
import { HERO } from "@/content/theme"
import { SITE_CONFIG } from "@/lib/site-config"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <GameLiveOverrideProvider>
      <SiteShellInner>{children}</SiteShellInner>
    </GameLiveOverrideProvider>
  )
}

function SiteShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { showGate, grantBypass } = useThemeGate()
  const showHeroSignMount = pathname === "/"

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (showGate) {
    return <ThemeGate onUnlock={grantBypass} />
  }

  return (
    <div className={`min-h-screen ${PIXEL_GRID_BG} pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0`}>
      <div className="relative">
        <div id="site-header-sticky" className="sticky top-0 z-40 md:bg-[#f0ebe3] md:dark:bg-[#1e1814]">
          <DesktopSiteNav />
          <HeadsUpBanner />
          {showHeroSignMount && HERO.showSignMount && (
            <div id="hero-sign-mount" className="hero-sign-mount" aria-hidden="true">
              <span className="hero-sign__bar" />
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
      <MobileSiteNav />
      <main id="main-content">{children}</main>
      <footer className={`border-t-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_PRIMARY}`}>
        <div className="container mx-auto px-4 py-10">
          <div className={`text-center font-mono text-xs md:text-sm ${PIXEL_TEXT_MUTED}`}>
            <p className={`mx-auto inline-block ${PIXEL_FRAME} ${DESK_RING.bl} px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)]`}>
              {`>> HUMANS VS. ZOMBIES ${SITE_CONFIG.gameYear} <<`}
            </p>
          </div>
        </div>
      </footer>
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={[
            "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 z-40 md:bottom-6 md:left-auto md:right-6",
            "flex h-12 w-12 items-center justify-center rounded-none border-4 border-[#8a7a68] bg-[#f5f0e6] text-[#5c4a38] dark:border-[#5c4d3a] dark:bg-[#2a2420]",
            "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)] active:translate-x-[1px] active:translate-y-[1px]",
          ].join(" ")}
        >
          <ArrowUp className="h-5 w-5 text-[#5c4a38] dark:text-amber-200" aria-hidden="true" />
        </button>
      )}
      <GameLiveDevPanel />
    </div>
  )
}

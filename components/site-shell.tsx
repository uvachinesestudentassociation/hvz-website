"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUp } from "lucide-react"
import { DeskTiltEffects } from "@/components/desk-tilt-effects"
import { GameLiveDevPanel } from "@/components/game-live-dev-panel"
import { GameStartCeremony } from "@/components/game-start-ceremony"
import { DuskTheme } from "@/components/dusk-theme"
import { MobileSiteNav } from "@/components/site-nav"
import { PIXEL_GRID_BG } from "@/components/hvz/pixel-styles"
import { GameLiveOverrideProvider } from "@/hooks/game-live-override"
import { GameStartCeremonyProvider } from "@/hooks/game-start-ceremony"
import { HERO } from "@/content/theme"

/** Local /alt experiments only — safe no-op when those folders are gitignored. */
function isAltExperimentPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === "/alt" || pathname.startsWith("/alt/")
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <GameLiveOverrideProvider>
      <DuskTheme>
        <GameStartCeremonyProvider>
          <SiteShellInner>{children}</SiteShellInner>
        </GameStartCeremonyProvider>
      </DuskTheme>
    </GameLiveOverrideProvider>
  )
}

function SiteShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const showHeroSignMount = pathname === "/" || pathname === "/lab" || isAltExperimentPath(pathname)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={`min-h-screen ${PIXEL_GRID_BG} pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0`}>
      <div className="relative">
        <div id="site-header-sticky" className="sticky top-0 z-40 md:hidden">
          {showHeroSignMount && HERO.showSignMount && pathname !== "/" && (
            <div
              id="hero-sign-mount"
              className={pathname === "/" ? "hero-sign-mount md:hidden" : "hero-sign-mount"}
              aria-hidden="true"
            >
              <span className="hero-sign__bar" />
            </div>
          )}
        </div>
      </div>
      <MobileSiteNav />
      <main id="main-content">{children}</main>
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={[
            isAltExperimentPath(pathname)
              ? "fixed bottom-[calc(10.5rem+env(safe-area-inset-bottom))] left-4 z-40 md:bottom-28 md:left-auto md:right-6"
              : "fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-4 z-40 md:bottom-6 md:left-auto md:right-6",
            "hidden h-12 w-12 items-center justify-center rounded-none border-4 border-[#8a7a68] bg-[#f5f0e6] text-[#5c4a38] dark:border-[#5c4d3a] dark:bg-[#2a2420] md:flex",
            "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)] active:translate-x-[1px] active:translate-y-[1px]",
          ].join(" ")}
        >
          <ArrowUp className="h-5 w-5 text-[var(--px-accent)]" aria-hidden="true" />
        </button>
      )}
      <DeskTiltEffects />
      <GameStartCeremony />
      <GameLiveDevPanel />
    </div>
  )
}

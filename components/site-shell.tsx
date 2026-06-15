"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { HeadsUpBanner } from "@/components/heads-up-banner"
import { DesktopSiteNav, MobileSiteNav } from "@/components/site-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { PIXEL_FRAME, PIXEL_GRID_BG, PIXEL_SECTION_BORDER, PIXEL_SECTION_EMERALD, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { SITE_CONFIG } from "@/lib/site-config"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className={`min-h-screen ${PIXEL_GRID_BG} pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0`}>
      <div className="relative">
        <div className="sticky top-0 z-40 md:bg-white md:dark:bg-neutral-950">
          <DesktopSiteNav />
          <HeadsUpBanner />
        </div>
        <ThemeToggle />
      </div>
      <MobileSiteNav />
      <main id="main-content">{children}</main>
      <footer className={`border-t-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_EMERALD}`}>
        <div className="container mx-auto px-4 py-10">
          <div className={`text-center font-mono text-xs md:text-sm ${PIXEL_TEXT_MUTED}`}>
            <p className={`mx-auto inline-block ${PIXEL_FRAME} px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)]`}>
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
            "flex h-12 w-12 items-center justify-center rounded-none border-4 border-neutral-900 bg-emerald-500 dark:border-neutral-300",
            "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)] active:translate-x-[1px] active:translate-y-[1px]",
          ].join(" ")}
        >
          <ArrowUp className={`h-5 w-5 ${PIXEL_TEXT}`} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

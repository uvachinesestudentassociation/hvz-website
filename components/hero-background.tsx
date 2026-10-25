import { HeroScanlines } from "@/components/hero-scanlines"
import { HeroTvStatic } from "@/components/hero-tv-static"
import { HERO } from "@/content/theme"

/** Hero background — night end of the active event theme. */
export function HeroBackground() {
  const { dark } = HERO.background

  return (
    <div className="hero-bg absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: dark.baseColor }} />

      {HERO.showZombieSilhouette && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/hero-zombie-silhouette.svg')] bg-[length:auto_55%] bg-[position:right_-2rem_bottom_-1rem] bg-no-repeat opacity-[0.12]"
        />
      )}

      <HeroScanlines />

      {HERO.showTvStatic && <HeroTvStatic />}

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, ${dark.vignette} 100%)`,
        }}
      />
    </div>
  )
}

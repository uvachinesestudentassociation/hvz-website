import { HeroScanlines } from "@/components/hero-scanlines"
import { HeroTvStatic } from "@/components/hero-tv-static"
import { HERO } from "@/content/theme"

const STATIC_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/** Hero background — driven by the active event theme. */
export function HeroBackground() {
  const { light, dark } = HERO.background

  return (
    <>
      {/* Light mode */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{ background: light.gradient }}
      />
      <div
        className="absolute inset-0 opacity-25 dark:hidden"
        style={{
          backgroundImage: `linear-gradient(90deg, ${light.grid} 1px, transparent 1px), linear-gradient(${light.grid} 1px, transparent 1px)`,
          backgroundSize: "8px 8px",
        }}
      />
      <div
        className="absolute inset-0 opacity-15 dark:hidden"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 47px, ${light.scanline} 47px, transparent 48px)`,
        }}
      />
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, ${light.vignette} 100%)`,
        }}
      />
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: STATIC_NOISE,
          opacity: light.noiseOpacity,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-6 dark:hidden"
        style={{
          backgroundImage: `linear-gradient(45deg, ${light.floorLight} 25%, transparent 25%), linear-gradient(-45deg, ${light.floorLight} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${light.floorLight} 75%), linear-gradient(-45deg, transparent 75%, ${light.floorLight} 75%)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          backgroundColor: light.floorBase,
          boxShadow: `0 -4px 0 ${light.vignette} inset`,
        }}
      />
      <div
        className="absolute -bottom-6 left-0 right-0 h-6 dark:hidden"
        style={{
          backgroundImage: `linear-gradient(45deg, ${light.floorDark} 25%, transparent 25%), linear-gradient(-45deg, ${light.floorDark} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${light.floorDark} 75%), linear-gradient(-45deg, transparent 75%, ${light.floorDark} 75%)`,
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
          backgroundColor: light.floorLight,
        }}
      />

      {/* Dark mode */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{ backgroundColor: dark.baseColor }}
      />

      {HERO.showZombieSilhouette && (
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[url('/hero-zombie-silhouette.svg')] bg-[length:auto_55%] bg-[position:right_-2rem_bottom_-1rem] bg-no-repeat opacity-[0.12] dark:block"
        />
      )}

      <HeroScanlines />

      {HERO.showTvStatic && <HeroTvStatic />}

      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `radial-gradient(ellipse 85% 75% at 50% 45%, transparent 55%, ${dark.vignette} 100%)`,
        }}
      />
    </>
  )
}

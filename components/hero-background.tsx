import { HeroTvStatic } from "@/components/hero-tv-static"

const STATIC_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/** Hero background — daytime office (light) vs FNAF static CRT (dark). */
export function HeroBackground() {
  return (
    <>
      {/* Light: fluorescent-lit office with subtle monitor cues */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f5f2eb_0%,#e8e4dc_45%,#d4cfc4_100%)] dark:hidden" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(120,100,80,0.05)_1px,transparent_1px),linear-gradient(rgba(120,100,80,0.05)_1px,transparent_1px)] bg-[size:8px_8px] dark:hidden" />
      <div className="absolute inset-0 opacity-15 [background-image:repeating-linear-gradient(0deg,transparent,transparent_47px,rgba(120,100,80,0.03)_47px,transparent_48px)] dark:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,transparent_40%,rgba(60,50,40,0.15)_100%)] dark:hidden" />
      <div
        className="absolute inset-0 opacity-20 dark:hidden"
        style={{ backgroundImage: STATIC_NOISE }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-6 [background-image:linear-gradient(45deg,#c9c4b8_25%,transparent_25%),linear-gradient(-45deg,#c9c4b8_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#c9c4b8_75%),linear-gradient(-45deg,transparent_75%,#c9c4b8_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] bg-[#d4cfc4] shadow-[0_-4px_0_rgba(60,50,40,0.15)_inset] dark:hidden" />
      <div className="absolute -bottom-6 left-0 right-0 h-6 [background-image:linear-gradient(45deg,#b8b3a8_25%,transparent_25%),linear-gradient(-45deg,#b8b3a8_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#b8b3a8_75%),linear-gradient(-45deg,transparent_75%,#b8b3a8_75%)] [background-size:16px_16px] [background-position:0_0,0_8px,8px_-8px,-8px_0px] bg-[#c9c4b8] shadow-[0_4px_0_rgba(60,50,40,0.12)_inset] dark:hidden" />

      {/* Dark: FNAF static CRT menu — lifted off pure black so snow reads */}
      <div className="absolute inset-0 hidden bg-[#0c0c0c] dark:block" />

      {/* Zombie silhouette behind static */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[url('/hero-zombie-silhouette.svg')] bg-[length:auto_55%] bg-[position:right_-2rem_bottom_-1rem] bg-no-repeat opacity-[0.12] dark:block"
      />

      {/* Hero-scoped scanlines */}
      <div className="hero-scanline-animated absolute inset-0 hidden opacity-60 [background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.06)_1px,rgba(255,255,255,0.06)_2px)] motion-reduce:animate-none [animation:hero-scanline-fine_0.2s_linear_infinite] dark:block" />
      <div className="hero-scanline-animated absolute inset-0 hidden opacity-40 [background-image:repeating-linear-gradient(0deg,transparent,transparent_47px,rgba(255,255,255,0.04)_47px,rgba(255,255,255,0.04)_48px)] motion-reduce:animate-none [animation:scanline-drift_16s_linear_infinite] dark:block" />

      {/* Live TV static snow */}
      <HeroTvStatic />

      <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_55%,rgba(0,0,0,0.25)_100%)] dark:block" />
    </>
  )
}

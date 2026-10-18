"use client"

import { useEffect, useRef } from "react"
import { createTimer, utils } from "animejs"
import { HERO } from "@/content/theme"

const LOGO_TEXT = "HUMANS VS. ZOMBIES"
const REDUCED_MQ = "(prefers-reduced-motion: reduce)"

function useHeroSignSwing(swingRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const swing = swingRef.current
    if (!swing) return
    if (window.matchMedia(REDUCED_MQ).matches) return

    const SWING_SPEED = 1.15
    const SWING_AMPLITUDE_DEG = (0.035 * 180) / Math.PI
    const startTime = performance.now()
    let phase = 0
    let lastScrollY = window.scrollY

    const timer = createTimer({
      duration: 1000,
      loop: true,
      frameRate: 60,
      onUpdate: () => {
        const t = (performance.now() - startTime) / 1000
        const angle = Math.sin(t * SWING_SPEED + phase) * SWING_AMPLITUDE_DEG
        utils.set(swing, { rotate: angle })
      },
    })

    const onScroll = () => {
      phase += (window.scrollY - lastScrollY) * 0.008
      lastScrollY = window.scrollY
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      timer.revert()
      window.removeEventListener("scroll", onScroll)
    }
  }, [swingRef])
}

function PlainHeroLogo() {
  return (
    <h1 className="hero-logo" data-text={LOGO_TEXT}>
      <span className="hero-logo__text">{LOGO_TEXT}</span>
    </h1>
  )
}

function FnafHeroLogo() {
  const swingRef = useRef<HTMLDivElement>(null)

  useHeroSignSwing(swingRef)

  return (
    <div className="hero-sign">
      <div ref={swingRef} className="hero-sign__swing">
        <div className="hero-sign__panel">
          <div className="hero-sign__hanger" aria-hidden="true">
            <span className="hero-sign__bar" />
            <span className="hero-sign__rope hero-sign__rope--left" />
            <span className="hero-sign__rope hero-sign__rope--right" />
          </div>
          <h1 className="hero-logo" data-text={LOGO_TEXT}>
            <span className="hero-logo__text">{LOGO_TEXT}</span>
          </h1>
        </div>
      </div>
    </div>
  )
}

export function HeroLogo() {
  if (HERO.logoStyle === "fnaf-sign") {
    return <FnafHeroLogo />
  }
  return <PlainHeroLogo />
}

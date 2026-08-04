"use client"

import { useEffect, useRef } from "react"
import { animate } from "animejs"
import { HERO } from "@/content/theme"

const REDUCED_MQ = "(prefers-reduced-motion: reduce)"

/** Dark-mode CRT scanline loops — anime.js owns the motion. */
export function HeroScanlines() {
  const fineRef = useRef<HTMLDivElement>(null)
  const coarseRef = useRef<HTMLDivElement>(null)
  const { dark } = HERO.background

  useEffect(() => {
    const fine = fineRef.current
    const coarse = coarseRef.current
    if (!fine || !coarse) return

    if (window.matchMedia(REDUCED_MQ).matches) return

    const fineAnim = animate(fine, {
      backgroundPositionY: ["0px", "2px"],
      duration: 200,
      ease: "linear",
      loop: true,
    })

    const coarseAnim = animate(coarse, {
      backgroundPositionY: ["0px", "48px"],
      duration: 16000,
      ease: "linear",
      loop: true,
    })

    return () => {
      fineAnim.revert()
      coarseAnim.revert()
    }
  }, [])

  return (
    <>
      <div
        ref={fineRef}
        className="absolute inset-0 hidden opacity-60 dark:block"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, ${dark.scanlineFine} 1px, ${dark.scanlineFine} 2px)`,
        }}
        aria-hidden="true"
      />
      <div
        ref={coarseRef}
        className="absolute inset-0 hidden opacity-40 dark:block"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 47px, ${dark.scanlineCoarse} 47px, ${dark.scanlineCoarse} 48px)`,
        }}
        aria-hidden="true"
      />
    </>
  )
}

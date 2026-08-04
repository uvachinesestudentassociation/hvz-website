"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"
import { animate, onScroll, utils } from "animejs"
import { cn } from "@/lib/utils"

const MOBILE_MQ = "(max-width: 767px)"
const REDUCED_MQ = "(prefers-reduced-motion: reduce)"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in ms once revealed (keep ≤ 160 for short lists). */
  delay?: number
}

/**
 * Fade/slide-up when entering the viewport. Active on mobile only —
 * desktop keeps content static (hover already provides motion there).
 * Motion is driven by anime.js.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia(REDUCED_MQ).matches
    const isMobile = window.matchMedia(MOBILE_MQ).matches

    if (reduced || !isMobile) {
      utils.set(el, { opacity: 1, y: 0 })
      return
    }

    const rect = el.getBoundingClientRect()
    const alreadyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 40

    if (alreadyInView) {
      utils.set(el, { opacity: 1, y: 0 })
      return
    }

    utils.set(el, { opacity: 0, y: 14 })

    let anim: ReturnType<typeof animate> | null = null

    const observer = onScroll({
      target: el,
      enter: "top 92%",
      repeat: false,
      onEnter: () => {
        anim = animate(el, {
          opacity: 1,
          y: 0,
          duration: 680,
          delay,
          ease: "outExpo",
        })
      },
    })

    return () => {
      anim?.revert()
      observer.revert()
    }
  }, [delay])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

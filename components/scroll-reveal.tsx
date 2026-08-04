"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
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
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<"pending" | "ready" | "in">("pending")

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia(REDUCED_MQ).matches
    const isMobile = window.matchMedia(MOBILE_MQ).matches

    if (reduced || !isMobile) {
      setPhase("in")
      return
    }

    const rect = el.getBoundingClientRect()
    const alreadyInView = rect.top < window.innerHeight * 0.92 && rect.bottom > 40

    if (alreadyInView) {
      setPhase("in")
      return
    }

    setPhase("ready")

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setPhase("in")
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties | undefined =
    delay > 0 && phase === "in" ? { transitionDelay: `${delay}ms` } : undefined

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal",
        phase === "ready" && "scroll-reveal--ready",
        phase === "in" && "scroll-reveal--in",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

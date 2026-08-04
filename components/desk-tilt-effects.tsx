"use client"

import { useEffect } from "react"
import { animate, utils } from "animejs"

const REDUCED_MQ = "(prefers-reduced-motion: reduce)"
const SELECTOR = ".desk-prop-tilt"

function tiltAngle(el: Element): number {
  if (el.classList.contains("desk-prop-tilt--left")) return -0.8
  if (el.classList.contains("desk-prop-tilt--right")) return 0.8
  return 0
}

/**
 * Anime.js hover straighten for desk-prop-tilt panels.
 * Class markers encode rest angle; anime owns rotate.
 */
export function DeskTiltEffects() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MQ).matches) return

    const primed = new WeakSet<HTMLElement>()

    const prime = (el: HTMLElement) => {
      if (primed.has(el)) return
      utils.set(el, { rotate: tiltAngle(el) })
      primed.add(el)
    }

    const primeAll = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(prime)
    }

    primeAll()

    const mo = new MutationObserver(primeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    const onEnter = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null
      if (!el) return
      prime(el)
      animate(el, { rotate: 0, duration: 80, ease: "linear" })
    }

    const onLeave = (event: Event) => {
      const el = (event.target as Element | null)?.closest?.(SELECTOR) as HTMLElement | null
      if (!el) return
      prime(el)
      animate(el, { rotate: tiltAngle(el), duration: 80, ease: "linear" })
    }

    document.addEventListener("pointerenter", onEnter, true)
    document.addEventListener("pointerleave", onLeave, true)

    return () => {
      mo.disconnect()
      document.removeEventListener("pointerenter", onEnter, true)
      document.removeEventListener("pointerleave", onLeave, true)
    }
  }, [])

  return null
}

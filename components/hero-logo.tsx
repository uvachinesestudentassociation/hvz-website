"use client"

import { useEffect, useRef } from "react"

const LOGO_TEXT = "HUMANS VS. ZOMBIES"
const MOUNT_ID = "hero-sign-mount"
const HEADER_ID = "site-header-sticky"

function useHeroSignRigging(
  swingRef: React.RefObject<HTMLDivElement | null>,
  leftAttachRef: React.RefObject<HTMLSpanElement | null>,
  rightAttachRef: React.RefObject<HTMLSpanElement | null>,
  leftWireRef: React.RefObject<SVGLineElement | null>,
  rightWireRef: React.RefObject<SVGLineElement | null>,
) {
  useEffect(() => {
    const swing = swingRef.current
    if (!swing) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const SWING_SPEED = 1.15
    const SWING_AMPLITUDE = 0.035
    const startTime = performance.now()
    let phase = 0
    let lastScrollY = window.scrollY
    let frame = 0
    let running = true

    const updateWires = () => {
      const leftWire = leftWireRef.current
      const rightWire = rightWireRef.current
      const leftAttach = leftAttachRef.current
      const rightAttach = rightAttachRef.current
      const mount = document.getElementById(MOUNT_ID)

      if (!leftWire || !rightWire || !leftAttach || !rightAttach || !mount) return

      const mountY = mount.getBoundingClientRect().bottom
      const leftPoint = leftAttach.getBoundingClientRect()
      const rightPoint = rightAttach.getBoundingClientRect()
      const leftX = leftPoint.left + leftPoint.width / 2
      const rightX = rightPoint.left + rightPoint.width / 2
      const leftY = leftPoint.top
      const rightY = rightPoint.top
      const visible = leftY > mountY + 1 && rightY > mountY + 1

      for (const [wire, x, y] of [
        [leftWire, leftX, leftY],
        [rightWire, rightX, rightY],
      ] as const) {
        wire.style.visibility = visible ? "visible" : "hidden"
        if (!visible) continue
        wire.setAttribute("x1", String(x))
        wire.setAttribute("y1", String(mountY))
        wire.setAttribute("x2", String(x))
        wire.setAttribute("y2", String(y))
      }
    }

    const tick = () => {
      if (!running) return

      if (!reducedMotion) {
        const t = (performance.now() - startTime) / 1000
        const angle = Math.sin(t * SWING_SPEED + phase) * SWING_AMPLITUDE
        swing.style.transform = `rotate(${angle}rad)`
      }

      updateWires()
      frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      if (!reducedMotion) {
        const delta = window.scrollY - lastScrollY
        phase += delta * 0.008
      }
      lastScrollY = window.scrollY
    }

    const header = document.getElementById(HEADER_ID)
    const mount = document.getElementById(MOUNT_ID)
    const observer = new ResizeObserver(updateWires)

    if (header) observer.observe(header)
    if (mount) observer.observe(mount)
    observer.observe(swing)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateWires)
    frame = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateWires)
    }
  }, [swingRef, leftAttachRef, rightAttachRef, leftWireRef, rightWireRef])
}

export function HeroLogo() {
  const swingRef = useRef<HTMLDivElement>(null)
  const leftAttachRef = useRef<HTMLSpanElement>(null)
  const rightAttachRef = useRef<HTMLSpanElement>(null)
  const leftWireRef = useRef<SVGLineElement>(null)
  const rightWireRef = useRef<SVGLineElement>(null)

  useHeroSignRigging(swingRef, leftAttachRef, rightAttachRef, leftWireRef, rightWireRef)

  return (
    <>
      <svg className="hero-sign__wires" aria-hidden="true">
        <line ref={leftWireRef} className="hero-sign__wire-line" />
        <line ref={rightWireRef} className="hero-sign__wire-line" />
      </svg>
      <div className="hero-sign">
        <div ref={swingRef} className="hero-sign__swing">
          <div className="hero-sign__panel">
            <span ref={leftAttachRef} className="hero-sign__attach hero-sign__attach--left" aria-hidden="true" />
            <span ref={rightAttachRef} className="hero-sign__attach hero-sign__attach--right" aria-hidden="true" />
            <h1 className="hero-logo" data-text={LOGO_TEXT}>
              <span className="hero-logo__text">{LOGO_TEXT}</span>
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}

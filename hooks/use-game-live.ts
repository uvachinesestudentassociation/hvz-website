"use client"

import { useEffect, useState } from "react"
import { isGameLive } from "@/lib/game-start"

export function useGameLive() {
  const [live, setLive] = useState(false)

  useEffect(() => {
    const tick = () => setLive(isGameLive())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return live
}

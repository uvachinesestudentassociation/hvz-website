"use client"

import { McButton } from "@/components/hvz/mc-button"
import { useGameLive } from "@/hooks/use-game-live"
import { SITE_CONFIG } from "@/lib/site-config"

export function JoinGameButton() {
  const live = useGameLive()

  if (!live) {
    return (
      <McButton
        size="lg"
        disabled
        aria-disabled="true"
        title="Signup opens when the game starts"
        className="cursor-not-allowed opacity-45 saturate-50"
      >
        Join the Game
      </McButton>
    )
  }

  return (
    <McButton size="lg" asChild>
      <a href={SITE_CONFIG.signupFormUrl} target="_blank" rel="noopener noreferrer">
        Join the Game
      </a>
    </McButton>
  )
}

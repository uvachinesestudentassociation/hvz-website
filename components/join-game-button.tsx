"use client"

import { McButton } from "@/components/hvz/mc-button"
import { useGameLive } from "@/hooks/use-game-live"
import { THEME_COPY } from "@/content/theme"
import { SITE_CONFIG } from "@/lib/site-config"

export function JoinGameButton() {
  const live = useGameLive()

  if (!live) {
    return (
      <McButton
        size="lg"
        disabled
        aria-disabled="true"
        title={THEME_COPY.joinButtonDisabled}
        className="cursor-not-allowed opacity-45 saturate-50"
      >
        {THEME_COPY.joinButton}
      </McButton>
    )
  }

  return (
    <McButton size="lg" asChild>
      <a href={SITE_CONFIG.signupFormUrl} target="_blank" rel="noopener noreferrer">
        {THEME_COPY.joinButton}
      </a>
    </McButton>
  )
}

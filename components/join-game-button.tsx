"use client"

import { useGameLive } from "@/hooks/use-game-live"
import { getGuardBadgeNumber } from "@/lib/game-start"
import { THEME_COPY } from "@/content/theme"
import {
  PIXEL_SECTION_BORDER,
  PIXEL_SURFACE,
  PIXEL_TEXT,
  PIXEL_TEXT_MUTED,
  PIXEL_TEXT_SUBTLE,
} from "@/components/hvz/pixel-styles"
import { SITE_CONFIG } from "@/lib/site-config"

const BADGE_CLASS = [
  "relative inline-block rounded-none border-4 px-5 py-3 text-center",
  PIXEL_SECTION_BORDER,
  PIXEL_SURFACE,
  "shadow-[4px_4px_0_rgba(0,0,0,0.35)] dark:shadow-[4px_4px_0_rgba(0,0,0,0.55)]",
  "before:pointer-events-none before:absolute before:inset-1 before:rounded-none",
  "before:border before:border-[#d4cfc4]/80 before:content-[''] dark:before:border-[#5c4d3a]/60",
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-none",
  "after:bg-[linear-gradient(135deg,rgba(255,255,255,0.22)_0%,transparent_42%,transparent_58%,rgba(255,255,255,0.08)_100%)]",
  "after:content-[''] dark:after:bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_42%,transparent_58%,rgba(255,255,255,0.03)_100%)]",
].join(" ")

export function JoinGameButton() {
  const live = useGameLive()
  const badgeNumber = getGuardBadgeNumber(SITE_CONFIG.gameYear)

  if (!live) {
    return (
      <div
        role="status"
        aria-disabled="true"
        title={THEME_COPY.joinButtonDisabled}
        className={[BADGE_CLASS, "cursor-not-allowed"].join(" ")}
      >
        <span
          className={`relative z-[1] block font-mono text-[11px] font-black uppercase tracking-[0.18em] ${PIXEL_TEXT_SUBTLE}`}
        >
          {THEME_COPY.guardBadgeAwaiting}
        </span>
        <span
          className={`relative z-[1] mt-2 block font-mono text-base font-black uppercase tracking-tight md:text-lg ${PIXEL_TEXT_SUBTLE}`}
        >
          {THEME_COPY.joinButton}
        </span>
        <span className={`relative z-[1] mt-1 block font-mono text-[10px] font-bold tracking-wide ${PIXEL_TEXT_SUBTLE}`}>
          {THEME_COPY.joinButtonDisabled}
        </span>
      </div>
    )
  }

  return (
    <a
      href={SITE_CONFIG.signupFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        BADGE_CLASS,
        "transition-transform hover:translate-x-[1px] hover:translate-y-[1px]",
      ].join(" ")}
    >
      <span
        className={`relative z-[1] block font-mono text-[11px] font-black uppercase tracking-[0.18em] ${PIXEL_TEXT_MUTED}`}
      >
        {THEME_COPY.guardBadgeActive(badgeNumber)}
      </span>
      <span
        className={`relative z-[1] mt-2 block font-mono text-base font-black uppercase tracking-tight md:text-lg ${PIXEL_TEXT}`}
      >
        {THEME_COPY.joinButton}
      </span>
    </a>
  )
}

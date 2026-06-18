"use client"

import { useGameLive } from "@/hooks/use-game-live"
import { THEME_COPY } from "@/content/theme"
import {
  PIXEL_HERO_SURFACE,
  PIXEL_SECTION_BORDER,
  PIXEL_TEXT,
  PIXEL_TEXT_MUTED,
  PIXEL_TEXT_SUBTLE,
} from "@/components/hvz/pixel-styles"
import { SITE_CONFIG } from "@/lib/site-config"

/** Matches hero tagline panel — framed monospace CRT readout */
const HERO_PANEL_CLASS = [
  `rounded-none border-4 ${PIXEL_SECTION_BORDER} ${PIXEL_HERO_SURFACE}`,
  "shadow-[4px_4px_0_rgba(88,28,135,0.2)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)]",
].join(" ")

export function JoinGameButton() {
  const live = useGameLive()

  if (!live) {
    return (
      <div
        role="status"
        aria-disabled="true"
        title={THEME_COPY.joinButtonDisabled}
        className={[HERO_PANEL_CLASS, "cursor-not-allowed px-6 py-4 text-center"].join(" ")}
      >
        <span
          className={`block font-mono text-base font-black uppercase tracking-tight md:text-lg ${PIXEL_TEXT_SUBTLE}`}
        >
          {THEME_COPY.joinButton}
        </span>
        <span className={`mt-1.5 block font-mono text-xs font-bold tracking-wide ${PIXEL_TEXT_SUBTLE}`}>
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
        HERO_PANEL_CLASS,
        `inline-block px-6 py-4 font-mono text-base font-black uppercase tracking-tight md:text-lg ${PIXEL_TEXT_MUTED}`,
        "transition-transform hover:translate-x-[1px] hover:translate-y-[1px]",
      ].join(" ")}
    >
      {THEME_COPY.joinButton}
    </a>
  )
}

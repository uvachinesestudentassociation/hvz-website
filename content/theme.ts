/**
 * FNAF event theme — colors and copy for webmasters.
 *
 * Update this file each game week. Revert after the event by restoring
 * default HvZ values, or set eventTheme to "default" when that flag exists.
 */

/** PWA / browser chrome color — also used in lib/site-config.ts */
export const THEME_COLOR = "#1a1025"

/** Tailwind class groups used across the site */
export const THEME = {
  accent: {
    text: "text-green-400",
    textDark: "dark:text-green-400",
    textHover: "hover:text-green-300 dark:hover:text-green-300",
    bg: "bg-green-500",
    bgSubtle: "bg-green-500/20",
    border: "border-green-600",
    ring: "focus-visible:ring-green-400/60",
    link: "text-green-600 dark:text-green-400",
    linkUnderline: "text-green-600 underline dark:text-green-400",
  },
  alarm: {
    text: "text-red-400",
    textStrong: "text-red-300",
    bg: "bg-red-950/60",
    bgLight: "bg-red-100 dark:bg-red-950/60",
    border: "border-red-800",
    nav: "text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300",
  },
  monitor: {
    text: "text-purple-300",
    bg: "bg-purple-950",
    border: "border-purple-800",
  },
  warning: {
    text: "text-amber-300",
    bg: "bg-amber-950",
    border: "border-amber-800",
  },
  button: {
    bg: "bg-purple-700",
    border: "border-purple-900 dark:border-purple-400",
  },
} as const

/** Event copy — HvZ game name stays; framing is night-shift / security office */
export const THEME_COPY = {
  tagline: "Survive your shift. Watch the cameras. Don't let them reach you.",
  joinButton: "Start Night Shift",
  joinButtonDisabled: "Shift opens when the game starts",
  sections: {
    quickLinks: ">> NIGHT SHIFT LINKS",
    alsoCheck: ">> ALSO ON FILE",
    explore: ">> SECURITY FEEDS",
    countdown: ">> SHIFT STARTS IN",
    gameOn: (year: number) => `>> SHIFT ACTIVE — HvZ ${year} <<`,
  },
} as const

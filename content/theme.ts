/**
 * FNAF event theme — colors and copy for webmasters.
 *
 * Update this file each game week. Revert after the event by restoring
 * default HvZ values, or set eventTheme to "default" when that flag exists.
 */

/** PWA / browser chrome color (dark mode default) — also used in lib/site-config.ts */
export const THEME_COLOR = "#000000";

/** PWA / browser chrome color for light mode */
export const THEME_COLOR_LIGHT = "#e8e4dc";

/** FNAF static CRT palette — pairs with globals.css .dark --static-* vars */
export const STATIC = {
  base: "#000000",
  surface: "#0a0a0a",
  text: "#f5f5f5",
  textMuted: "#737373",
  textDisabled: "#525252",
  border: "#525252",
  scanline: "rgba(255,255,255,0.05)",
} as const;

/** @deprecated Use STATIC — kept for any lingering imports */
export const CCTV = {
  phosphor: STATIC.text,
  phosphorDim: STATIC.border,
  feedDark: STATIC.base,
  feedMid: STATIC.surface,
  tint: "transparent",
} as const;

/** Daytime hero monitor palette — pairs with globals.css :root --cctv-* vars */
export const HERO_BG = {
  light: {
    gradient: "linear-gradient(180deg,#f5f2eb_0%,#e8e4dc_45%,#d4cfc4_100%)",
    grid: "rgba(120,100,80,0.05)",
    scanline: "rgba(120,100,80,0.03)",
    vignette: "rgba(60,50,40,0.15)",
    floorLight: "#c9c4b8",
    floorDark: "#b8b3a8",
    floorBase: "#d4cfc4",
    titleShadow: "rgba(88,28,135,0.35)",
    taglineShadow: "rgba(88,28,135,0.2)",
  },
  dark: {
    gradient: "linear-gradient(180deg,#000000_0%,#0a0a0a_100%)",
    grid: "rgba(255,255,255,0.05)",
    scanline: "rgba(255,255,255,0.04)",
    vignette: "rgba(0,0,0,0.5)",
    titleShadow: "rgba(255,255,255,0.15)",
    taglineShadow: "rgba(255,255,255,0.08)",
  },
} as const;

/** Daytime security office palette — below-hero light mode */
export const OFFICE = {
  laminate: "#e8e4dc",
  laminateLight: "#f0ebe3",
  paper: "#f5f0e6",
  manila: "#e8dcc8",
  border: "#8a7a68",
  text: "#3c3228",
  textMuted: "#6b5d4f",
  fluorescent: "rgba(200, 220, 255, 0.12)",
  windowGlow: "rgba(255, 248, 220, 0.08)",
} as const;

/** Nighttime security desk palette — below-hero dark mode */
export const DESK = {
  wood: "#1a1410",
  woodLight: "#221c16",
  paper: "#2f2922",
  manila: "#4a4036",
  border: "#5c4d3a",
  text: "#e8dfd0",
  textMuted: "#a89580",
  lamp: "rgba(251, 191, 36, 0.09)",
  monitorGlow: "rgba(74, 222, 128, 0.05)",
} as const;

/** Tailwind class groups used across the site */
export const THEME = {
  accent: {
    text: "text-[#5c4a38] dark:text-green-400",
    textDark: "dark:text-green-400",
    textHover: "hover:text-[#4a3c30] dark:hover:text-green-300",
    bg: "bg-[#8a7a68] dark:bg-green-950/40",
    bgSubtle: "bg-[#e8dcc8]/60 dark:bg-green-950/30",
    border: "border-[#8a7a68] dark:border-[#5c4d3a]",
    ring: "focus-visible:ring-[#a89070]/50 dark:focus-visible:ring-green-400/50",
    link: "text-[#5c4a38] dark:text-green-400",
    linkUnderline: "text-[#5c4a38] underline dark:text-green-400",
    navActive: "text-[#4a3c30] dark:text-amber-200",
  },
  alarm: {
    text: "text-red-400",
    textStrong: "text-red-300",
    bg: "bg-red-950/60",
    bgLight: "bg-red-100 dark:bg-[#2a2018] dark:border-amber-900/40",
    border: "border-red-800 dark:border-amber-900/50",
    nav: "text-red-600 hover:text-red-500 dark:text-amber-300/90 dark:hover:text-amber-200",
  },
  monitor: {
    text: "text-[#6b5d4f] dark:text-green-400/80",
    bg: "bg-[#e8e4dc] dark:bg-[#1a1410]",
    border: "border-[#8a7a68] dark:border-[#5c4d3a]",
  },
  warning: {
    text: "text-amber-800 dark:text-amber-300/90",
    bg: "bg-amber-100 dark:bg-[#2a2218]",
    border: "border-amber-700 dark:border-amber-900/40",
  },
  button: {
    bg: "bg-[#6b5d4f]",
    border: "border-[#8a7a68] dark:border-[#5c4d3a]",
  },
} as const;

/** Event copy — HvZ game name stays; framing is night-shift / security office */
export const THEME_COPY = {
  tagline: "Survive your shift. Watch the cameras. Don't let them reach you.",
  joinButton: "Start Night Shift",
  joinButtonDisabled: "Shift opens when the game starts",
  sections: {
    quickLinks: ">> SHIFT TOOLS",
    alsoCheck: ">> ALSO ON FILE",
    explore: ">> SECURITY FEEDS",
    countdown: ">> SHIFT STARTS IN",
    gameOn: (year: number) => `>> SHIFT ACTIVE — HvZ ${year} <<`,
  },
} as const;

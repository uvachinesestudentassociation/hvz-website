import { SITE_CONFIG } from "@/lib/site-config"

/**
 * Game start date/time — edit these values each season.
 * Uses SITE_CONFIG.gameYear for the year.
 */
export const GAME_START = {
  month: 10,
  day: 26,
  hour: 0,
  minute: 0,
  /** Eastern offset from UTC: -4 = EDT, -5 = EST */
  utcOffsetHours: -4,
} as const

/** Whole-game span in days from start. */
export const GAME_DURATION_DAYS = 7

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function getGameStartDate(): Date {
  const { month, day, hour, minute, utcOffsetHours } = GAME_START
  const year = SITE_CONFIG.gameYear
  const utcHour = hour - utcOffsetHours
  return new Date(Date.UTC(year, month - 1, day, utcHour, minute, 0, 0))
}

export function getGameStartLabel(): string {
  const { month, day, hour, minute } = GAME_START
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const ampm = hour < 12 ? "AM" : "PM"
  const minuteStr = minute.toString().padStart(2, "0")
  return `${MONTH_NAMES[month - 1]} ${day}, ${hour12}:${minuteStr} ${ampm} Eastern`
}

export function getTimeUntilGameStart(now = Date.now()): number {
  return getGameStartDate().getTime() - now
}

export function isGameLive(now = Date.now()): boolean {
  return getTimeUntilGameStart(now) <= 0
}

/** Light theme until this long before start, then the dimmer eases in. */
export const DUSK_FADE_MS = 2 * 60 * 60 * 1000

/** Inside this window the real dark theme is on and the dimmer is off. */
export const DUSK_NIGHT_LEAD_MS = 10 * 60 * 1000

/** 0 before the fade, 1 once night has taken over. Linear in between. */
export function duskAmount(now = Date.now()): number {
  const remaining = getTimeUntilGameStart(now)
  if (remaining <= DUSK_NIGHT_LEAD_MS) return 1
  if (remaining >= DUSK_FADE_MS) return 0
  const span = DUSK_FADE_MS - DUSK_NIGHT_LEAD_MS
  return (DUSK_FADE_MS - remaining) / span
}

export function isDuskNight(now = Date.now()): boolean {
  return getTimeUntilGameStart(now) <= DUSK_NIGHT_LEAD_MS
}

function easternDay(now: number): string {
  const shifted = new Date(now + GAME_START.utcOffsetHours * 60 * 60 * 1000)
  return shifted.toISOString().slice(0, 10)
}

/** Hall tubes flicker only on the Eastern day before start and the start day. */
export function hallLightsFlicker(now = Date.now()): boolean {
  const start = getGameStartDate().getTime()
  const day = easternDay(now)
  return day === easternDay(start) || day === easternDay(start - 24 * 60 * 60 * 1000)
}

export function getGameEndDate(): Date {
  const start = getGameStartDate()
  return new Date(start.getTime() + GAME_DURATION_DAYS * 24 * 60 * 60 * 1000)
}

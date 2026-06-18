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

/** Whole-game span — night segments split evenly across this duration. */
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

export function getGameEndDate(): Date {
  const start = getGameStartDate()
  return new Date(start.getTime() + GAME_DURATION_DAYS * 24 * 60 * 60 * 1000)
}

/** FNAF-style night hours shown during the live game (12 → 3 → 6 AM). */
export type NightShiftHour = 12 | 3 | 6

const NIGHT_SHIFT_HOURS: NightShiftHour[] = [12, 3, 6]

export function getNightShiftHour(now = Date.now()): NightShiftHour {
  const start = getGameStartDate().getTime()
  const end = getGameEndDate().getTime()
  const duration = end - start
  if (duration <= 0) return 12

  const elapsed = Math.min(Math.max(0, now - start), duration)
  const segment = Math.min(
    NIGHT_SHIFT_HOURS.length - 1,
    Math.floor((elapsed / duration) * NIGHT_SHIFT_HOURS.length),
  )
  return NIGHT_SHIFT_HOURS[segment]!
}

export function getGuardBadgeNumber(gameYear: number): string {
  return (gameYear % 1000).toString().padStart(3, "0")
}

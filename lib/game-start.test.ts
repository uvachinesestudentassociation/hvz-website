import { expect, test } from "vitest"
import {
  DUSK_FADE_MS,
  DUSK_NIGHT_LEAD_MS,
  duskAmount,
  getGameEndDate,
  getGameStartDate,
  getGameStartLabel,
  isDuskNight,
  isGameLive,
  hallLightsFlicker,
} from "./game-start"
import { isSiteUnlocked } from "./theme-gate"

const start = getGameStartDate()

test("game start is midnight Eastern on the configured date", () => {
  expect(start.toISOString()).toBe("2026-10-26T04:00:00.000Z")
})

test("game is not live one millisecond before start and is live at start", () => {
  expect(isGameLive(start.getTime() - 1)).toBe(false)
  expect(isGameLive(start.getTime())).toBe(true)
})

test("start label uses 12-hour midnight Eastern", () => {
  expect(getGameStartLabel()).toBe("October 26, 12:00 AM Eastern")
})

test("game end is seven days after start", () => {
  expect(getGameEndDate().getTime() - start.getTime()).toBe(7 * 24 * 60 * 60 * 1000)
})

test("dusk stays light until seven days out, then fades, then night for the last hour", () => {
  expect(duskAmount(start.getTime() - DUSK_FADE_MS - 1)).toBe(0)
  expect(isDuskNight(start.getTime() - DUSK_FADE_MS - 1)).toBe(false)

  expect(duskAmount(start.getTime() - DUSK_FADE_MS)).toBe(0)
  const mid = start.getTime() - (DUSK_FADE_MS + DUSK_NIGHT_LEAD_MS) / 2
  expect(duskAmount(mid)).toBeCloseTo(0.5)
  const early = start.getTime() - DUSK_FADE_MS + (DUSK_FADE_MS - DUSK_NIGHT_LEAD_MS) / 4
  expect(duskAmount(early)).toBeCloseTo(0.15625)
  expect(isDuskNight(mid)).toBe(false)

  expect(duskAmount(start.getTime() - DUSK_NIGHT_LEAD_MS)).toBe(1)
  expect(isDuskNight(start.getTime() - DUSK_NIGHT_LEAD_MS)).toBe(true)
  expect(duskAmount(start.getTime())).toBe(1)
  expect(isDuskNight(start.getTime() + 1000)).toBe(true)
})

test("hallway lights flicker only the day before and the day of start", () => {
  const day = 24 * 60 * 60 * 1000
  expect(hallLightsFlicker(start.getTime() - 2 * day)).toBe(false)
  expect(hallLightsFlicker(start.getTime() - day)).toBe(true)
  expect(hallLightsFlicker(start.getTime() - 60 * 60 * 1000)).toBe(true)
  expect(hallLightsFlicker(start.getTime())).toBe(true)
  expect(hallLightsFlicker(start.getTime() + 12 * 60 * 60 * 1000)).toBe(true)
  expect(hallLightsFlicker(start.getTime() + day)).toBe(false)
})

test("site is unlocked before game start while the theme gate is off", () => {
  expect(isSiteUnlocked(start.getTime() - 1)).toBe(true)
  expect(isSiteUnlocked(start.getTime())).toBe(true)
})

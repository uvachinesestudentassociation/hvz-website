import { expect, test } from "vitest"
import {
  getGameEndDate,
  getGameStartDate,
  getGameStartLabel,
  isGameLive,
  hallLightsFlicker,
} from "./game-start"
import { isSiteUnlocked } from "./theme-gate"

const start = getGameStartDate()

test("game start is 11:15 PM Eastern on the configured date", () => {
  expect(start.toISOString()).toBe("2026-10-24T03:15:00.000Z")
})

test("game is not live one millisecond before start and is live at start", () => {
  expect(isGameLive(start.getTime() - 1)).toBe(false)
  expect(isGameLive(start.getTime())).toBe(true)
})

test("start label uses 12-hour Eastern time", () => {
  expect(getGameStartLabel()).toBe("October 23, 11:15 PM Eastern")
})

test("game end is seven days after start", () => {
  expect(getGameEndDate().getTime() - start.getTime()).toBe(7 * 24 * 60 * 60 * 1000)
})

test("hallway lights flicker only the day before and the day of start", () => {
  const day = 24 * 60 * 60 * 1000
  expect(hallLightsFlicker(start.getTime() - 2 * day)).toBe(false)
  expect(hallLightsFlicker(start.getTime() - day)).toBe(true)
  expect(hallLightsFlicker(start.getTime() - 60 * 60 * 1000)).toBe(true)
  expect(hallLightsFlicker(start.getTime())).toBe(true)
  // Start is 11:15 PM, so twelve hours later is the next Eastern day.
  expect(hallLightsFlicker(start.getTime() + 30 * 60 * 1000)).toBe(true)
  expect(hallLightsFlicker(start.getTime() + day)).toBe(false)
})

test("site is unlocked before game start while the theme gate is off", () => {
  expect(isSiteUnlocked(start.getTime() - 1)).toBe(true)
  expect(isSiteUnlocked(start.getTime())).toBe(true)
})

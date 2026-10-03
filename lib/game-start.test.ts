import { expect, test } from "vitest"
import {
  getGameEndDate,
  getGameStartDate,
  getGameStartLabel,
  isGameLive,
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

test("site stays locked until the start instant while the theme gate is enabled", () => {
  expect(isSiteUnlocked(start.getTime() - 1)).toBe(false)
  expect(isSiteUnlocked(start.getTime())).toBe(true)
})

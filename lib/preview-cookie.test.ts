import { expect, test } from "vitest"
import { previewCookieMatchesEdge } from "./preview-cookie-edge"
import { codesMatch, previewCookieMatches, previewCookieValue } from "./preview-cookie"

const secret = "fixture-preview-key"
const gameYear = 2026

test("code compare ignores case and surrounding spaces", () => {
  expect(codesMatch("  abcd  ", "ABCD")).toBe(true)
})

test("code compare rejects a different string of the same length and of a different length", () => {
  expect(codesMatch("abcd", "abce")).toBe(false)
  expect(codesMatch("abcd", "abc")).toBe(false)
})

test("cookie match accepts the signed value and rejects a stand-in or missing value", () => {
  const signed = previewCookieValue(secret, gameYear)
  expect(previewCookieMatches(signed, secret, gameYear)).toBe(true)
  expect(previewCookieMatches("x".repeat(signed.length), secret, gameYear)).toBe(false)
  expect(previewCookieMatches(undefined, secret, gameYear)).toBe(false)
  expect(previewCookieMatches("1", secret, gameYear)).toBe(false)
})

test("a cookie signed for another year does not unlock this season", () => {
  const otherYear = previewCookieValue(secret, gameYear - 1)
  expect(previewCookieMatches(otherYear, secret, gameYear)).toBe(false)
})

test("the edge compare accepts the same signed value as the node HMAC", async () => {
  const signed = previewCookieValue(secret, gameYear)
  expect(await previewCookieMatchesEdge(signed, secret, gameYear)).toBe(true)
  expect(await previewCookieMatchesEdge("1", secret, gameYear)).toBe(false)
})

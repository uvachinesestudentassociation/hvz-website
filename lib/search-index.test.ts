import { expect, test } from "vitest"
import { SPECIFIC_RULES } from "@/content/rules"
import { SAFE_ZONE_SECTIONS } from "@/content/safe-zones"
import { buildSearchIndex, searchRules } from "./search-index"

test("empty and whitespace queries return no results", () => {
  expect(searchRules("")).toEqual([])
  expect(searchRules("   ")).toEqual([])
})

test("a known rules word returns a snippet that contains the match", () => {
  const results = searchRules("stun")
  expect(results.length).toBeGreaterThan(0)
  expect(results.some((result) => result.snippet.toLowerCase().includes("stun"))).toBe(true)
})

test("every specific rule and safe zone id is linked from the index", () => {
  const hrefs = buildSearchIndex().map((entry) => entry.href)
  for (const rule of SPECIFIC_RULES) {
    expect(hrefs).toContain(`/rules#${rule.id}`)
  }
  for (const zone of SAFE_ZONE_SECTIONS) {
    expect(hrefs).toContain(`/safe-zones#${zone.id}`)
  }
})

test("every search href is an absolute path", () => {
  const index = buildSearchIndex()
  expect(index.length).toBeGreaterThan(0)
  for (const entry of index) {
    expect(entry.href.startsWith("/")).toBe(true)
    expect(entry.href).not.toBe("#heads-up")
  }
})

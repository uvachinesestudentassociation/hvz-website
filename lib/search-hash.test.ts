import { expect, test } from "vitest"
import { disclosureShouldOpen } from "./search-hash"

test("empty hash does not open a disclosure", () => {
  expect(disclosureShouldOpen("", "basic-rules", ["zombie-rules"])).toBe(false)
  expect(disclosureShouldOpen("#", "basic-rules", ["zombie-rules"])).toBe(false)
})

test("a descendant hash opens the parent disclosure", () => {
  expect(disclosureShouldOpen("#zombie-rules", "basic-rules", ["zombie-rules"])).toBe(true)
})

test("the disclosure's own id opens it", () => {
  expect(disclosureShouldOpen("#basic-rules", "basic-rules", [])).toBe(true)
})

test("an unrelated hash does not open the disclosure", () => {
  expect(disclosureShouldOpen("#residences", "basic-rules", ["zombie-rules"])).toBe(false)
})

test("a hash without a leading hash mark still matches", () => {
  expect(disclosureShouldOpen("zombie-rules", "basic-rules", ["zombie-rules"])).toBe(true)
})

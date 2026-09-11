import { expect, test } from "vitest"
import { getBountyDisplay } from "./bounty-display"

const secret = {
  name: "SECRET NAME",
  imageSrc: "/bounty/target.jpg",
  reward: "250 points",
  note: "Bring proof.",
  href: "https://example.com/claim",
}

test("a missing target is vacant whether or not reveal is on", () => {
  expect(getBountyDisplay(null, true)).toEqual({ kind: "vacant" })
  expect(getBountyDisplay(null, false)).toEqual({ kind: "vacant" })
})

test("a sealed target does not expose its fields", () => {
  const display = getBountyDisplay(secret, false)
  expect(display).toEqual({ kind: "sealed" })
  expect("name" in display).toBe(false)
})

test("a revealed target includes the name", () => {
  const display = getBountyDisplay(secret, true)
  expect(display.kind).toBe("revealed")
  if (display.kind !== "revealed") return
  expect(display.name).toBe("SECRET NAME")
})

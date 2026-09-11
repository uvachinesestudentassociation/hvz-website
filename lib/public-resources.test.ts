import { expect, test } from "vitest"
import { LINKS } from "@/content/links"
import { PUBLIC_RESOURCES, getResource } from "./public-resources"

test("every configured link is a non-empty https URL", () => {
  for (const url of Object.values(LINKS)) {
    expect(url.length).toBeGreaterThan(0)
    expect(url.startsWith("https://")).toBe(true)
  }
})

test("public resources resolve to https URLs and do not include the signup form", () => {
  for (const resource of PUBLIC_RESOURCES) {
    expect(resource.href.startsWith("https://")).toBe(true)
    expect(resource.id).not.toBe("signupForm")
  }
})

test("kill and quest forms are wired through LINKS", () => {
  expect(getResource("killReport").href).toBe(LINKS.killReport)
  expect(getResource("questReport").href).toBe(LINKS.questReport)
})

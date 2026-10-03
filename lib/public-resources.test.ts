import { expect, test } from "vitest"
import { LINKS, questBoardEmbedUrl } from "@/content/links"
import { PUBLIC_RESOURCES, getResource } from "./public-resources"

test("every configured link is a non-empty https URL", () => {
  for (const url of Object.values(LINKS)) {
    if (!url) continue
    expect(url.startsWith("https://")).toBe(true)
  }
})

test("public resources resolve to https URLs and do not include the signup form", () => {
  for (const resource of PUBLIC_RESOURCES) {
    expect(resource.id).not.toBe("signupForm")
    if (!resource.href) continue
    expect(resource.href.startsWith("https://")).toBe(true)
  }
})

test("quest board embed url uses the presentation id", () => {
  expect(questBoardEmbedUrl("")).toBeNull()
  expect(questBoardEmbedUrl(LINKS.killReport)).toBeNull()
  expect(
    questBoardEmbedUrl("https://docs.google.com/presentation/d/abc_DEF-123/edit?usp=sharing"),
  ).toBe("https://docs.google.com/presentation/d/abc_DEF-123/embed?start=false&loop=false&rm=minimal")
})

test("kill and quest forms are wired through LINKS", () => {
  expect(getResource("killReport").href).toBe(LINKS.killReport)
  expect(getResource("questReport").href).toBe(LINKS.questReport)
})

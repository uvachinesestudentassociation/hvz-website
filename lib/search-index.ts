import { HEADS_UP_ITEMS } from "@/content/heads-up"
import {
  BASIC_RULES_INTRO,
  BASIC_RULES_SUBSECTIONS,
  SPECIFIC_RULES,
} from "@/content/rules"
import { SAFE_ZONE_SECTIONS } from "@/content/safe-zones"
import { THINGS_TO_NOTE } from "@/content/things-to-note"

export type SearchResult = {
  id: string
  section: string
  title: string
  snippet: string
  href: string
}

function flattenTexts(...groups: (string | undefined)[][]): string[] {
  return groups.flat().filter((t): t is string => Boolean(t))
}

function buildSnippet(text: string, query: string): string {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, 120) + (text.length > 120 ? "…" : "")
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 80)
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "")
}

export function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = []

  HEADS_UP_ITEMS.forEach((item, i) => {
    results.push({
      id: `heads-up-${i}`,
      section: "Heads up",
      title: "Latest rule tweaks",
      snippet: item,
      href: "#heads-up",
    })
  })

  results.push({
    id: "things-to-note-warning",
    section: "Things to Note",
    title: "Community Chairs authority",
    snippet: THINGS_TO_NOTE.warning,
    href: "/rules#things-to-note",
  })

  THINGS_TO_NOTE.paragraphs.forEach((p, i) => {
    results.push({
      id: `things-to-note-${i}`,
      section: "Things to Note",
      title: "Important notice",
      snippet: p,
      href: "/rules#things-to-note",
    })
  })

  BASIC_RULES_INTRO.forEach((p, i) => {
    results.push({
      id: `basic-intro-${i}`,
      section: "Basic Rules",
      title: "Overview",
      snippet: p,
      href: "/rules#basic-rules",
    })
  })

  BASIC_RULES_SUBSECTIONS.forEach((sub) => {
    sub.paragraphs?.forEach((p, i) => {
      results.push({
        id: `${sub.id}-p-${i}`,
        section: "Basic Rules",
        title: sub.heading,
        snippet: p,
        href: `/rules#${sub.id}`,
      })
    })
    sub.items?.forEach((item, i) => {
      results.push({
        id: `${sub.id}-${i}`,
        section: "Basic Rules",
        title: sub.heading,
        snippet: item,
        href: `/rules#${sub.id}`,
      })
    })
  })

  SPECIFIC_RULES.forEach((rule) => {
    results.push({
      id: rule.id,
      section: "Specific Rules",
      title: rule.heading,
      snippet: rule.body,
      href: `/rules#${rule.id}`,
    })
  })

  SAFE_ZONE_SECTIONS.forEach((zone) => {
    zone.paragraphs.forEach((p, i) => {
      results.push({
        id: `${zone.id}-p-${i}`,
        section: "Safe Zones",
        title: zone.title,
        snippet: p,
        href: `/safe-zones#${zone.id}`,
      })
    })
    zone.listItems?.forEach((item, i) => {
      results.push({
        id: `${zone.id}-${i}`,
        section: "Safe Zones",
        title: zone.title,
        snippet: item,
        href: `/safe-zones#${zone.id}`,
      })
    })
  })

  return results
}

export function searchRules(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const index = buildSearchIndex()
  return index.filter((entry) => {
    const haystack = flattenTexts([entry.section, entry.title, entry.snippet]).join(" ").toLowerCase()
    return haystack.includes(q)
  }).map((entry) => ({
    ...entry,
    snippet: buildSnippet(entry.snippet, query),
  }))
}

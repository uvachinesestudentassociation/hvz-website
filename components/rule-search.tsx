"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"
import { searchRules, type SearchResult } from "@/lib/search-index"

function SearchResults({ results }: { results: SearchResult[] }) {
  if (results.length === 0) {
    return (
      <p className={`py-4 text-center font-mono text-sm ${PIXEL_TEXT_SUBTLE}`}>
        No rules found. Try &quot;gym&quot;, &quot;stun&quot;, or &quot;safe zone&quot;.
      </p>
    )
  }

  return (
    <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
      {results.map((result) => (
        <li key={result.id}>
          <Link
            href={result.href}
            className={`block rounded-none border-2 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE} p-3 hover:bg-[#e8dcc8]/80 dark:hover:bg-[#2a2420]/90`}
          >
            <div className={`font-mono text-[10px] uppercase tracking-wider ${THEME.accent.link}`}>
              {result.section}
            </div>
            <div className={`font-mono text-sm font-bold ${PIXEL_TEXT}`}>{result.title}</div>
            <div className={`mt-1 font-mono text-xs ${PIXEL_TEXT_MUTED} break-words`}>{result.snippet}</div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function RuleSearch() {
  const [query, setQuery] = useState("")
  const inputId = useId()
  const results = useMemo(() => searchRules(query), [query])
  const typed = query.trim().length > 0

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Search rules
      </label>
      <Input
        id={inputId}
        type="search"
        enterKeyHint="search"
        placeholder="Search rules, e.g. gym or stun"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`min-h-12 rounded-none border-4 ${PIXEL_SECTION_BORDER} font-mono text-base`}
      />
      {typed && (
        <div className="mt-3">
          <SearchResults results={results} />
        </div>
      )}
    </div>
  )
}

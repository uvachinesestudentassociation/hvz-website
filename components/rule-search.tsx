"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"
import { searchRules, type SearchResult } from "@/lib/search-index"

type RuleSearchProps = {
  variant: "desktop" | "inline"
}

function SearchResults({ results, onSelect }: { results: SearchResult[]; onSelect?: () => void }) {
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
            onClick={onSelect}
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

export function RuleSearch({ variant }: RuleSearchProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputId = useId()

  const results = useMemo(() => searchRules(query), [query])

  const closeSearch = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement) active.blur()
    setOpen(false)
  }

  if (variant === "inline") {
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

  if (variant === "desktop") {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide ${PIXEL_TEXT_MUTED} ${THEME.accent.textHover} dark:text-[#a89580]`}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </button>
        </DrawerTrigger>
        <DrawerContent className={`rounded-none border-t-4 ${PIXEL_SECTION_BORDER}`}>
          <DrawerHeader>
            <DrawerTitle className="font-mono text-lg">Search Rules</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Input
              type="search"
              placeholder="e.g. gym, stun, safe zone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`rounded-none border-4 ${PIXEL_SECTION_BORDER} font-mono`}
              autoFocus
            />
            <div className="mt-4">
              <SearchResults results={results} onSelect={closeSearch} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return null
}

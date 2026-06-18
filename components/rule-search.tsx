"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
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
  variant: "desktop" | "mobile"
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
            className={`block rounded-none border-2 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE} p-3 hover:bg-purple-950/30 dark:hover:bg-purple-950/40`}
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

function blurActiveElement() {
  const active = document.activeElement
  if (active instanceof HTMLElement) {
    active.blur()
  }
}

export function RuleSearch({ variant }: RuleSearchProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const results = useMemo(() => searchRules(query), [query])

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      blurActiveElement()
    }
    setOpen(next)
  }

  const closeSearch = () => {
    blurActiveElement()
    setOpen(false)
  }

  if (variant === "desktop") {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className={`flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-neutral-700 ${THEME.accent.textHover} dark:text-neutral-300`}
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

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} repositionInputs={false}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Search rules"
          className={[
            `flex h-12 w-12 items-center justify-center rounded-none border-4 ${PIXEL_SECTION_BORDER} bg-white dark:bg-neutral-900`,
            "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)] active:translate-x-[1px] active:translate-y-[1px]",
          ].join(" ")}
        >
          <Search className={`h-5 w-5 ${THEME.accent.link}`} aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent className={`rounded-none border-t-4 ${PIXEL_SECTION_BORDER} pb-[env(safe-area-inset-bottom)]`}>
        <DrawerHeader className="relative">
          <DrawerTitle className="font-mono text-lg">Search Rules</DrawerTitle>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="absolute right-4 top-4 text-neutral-700 dark:text-neutral-300"
          >
            <X className="h-5 w-5" />
          </button>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <Input
            type="search"
            placeholder="e.g. gym, stun, safe zone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`rounded-none border-4 ${PIXEL_SECTION_BORDER} font-mono text-base`}
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

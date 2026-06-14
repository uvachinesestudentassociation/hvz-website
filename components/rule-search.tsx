"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { searchRules, type SearchResult } from "@/lib/search-index"

type RuleSearchProps = {
  variant: "desktop" | "mobile"
}

function SearchResults({ results, onSelect }: { results: SearchResult[]; onSelect?: () => void }) {
  if (results.length === 0) {
    return (
      <p className="py-4 text-center font-mono text-sm text-neutral-600">
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
            className="block rounded-none border-2 border-neutral-900 bg-white/80 p-3 hover:bg-emerald-50"
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-700">
              {result.section}
            </div>
            <div className="font-mono text-sm font-bold text-neutral-900">{result.title}</div>
            <div className="mt-1 font-mono text-xs text-neutral-700 break-words">{result.snippet}</div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function RuleSearch({ variant }: RuleSearchProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const results = useMemo(() => searchRules(query), [query])

  if (variant === "desktop") {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-neutral-700 hover:text-emerald-600"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </button>
        </DrawerTrigger>
        <DrawerContent className="rounded-none border-t-4 border-neutral-900">
          <DrawerHeader>
            <DrawerTitle className="font-mono text-lg">Search Rules</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <Input
              type="search"
              placeholder="e.g. gym, stun, safe zone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-none border-4 border-neutral-900 font-mono"
              autoFocus
            />
            <div className="mt-4">
              <SearchResults results={results} onSelect={() => setOpen(false)} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label="Search rules"
          className={[
            "flex h-12 w-12 items-center justify-center rounded-none border-4 border-neutral-900 bg-white",
            "shadow-[4px_4px_0_rgba(0,0,0,0.45)] active:translate-x-[1px] active:translate-y-[1px]",
          ].join(" ")}
        >
          <Search className="h-5 w-5 text-emerald-700" aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="rounded-none border-t-4 border-neutral-900 pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="relative">
          <DrawerTitle className="font-mono text-lg">Search Rules</DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Close search"
              className="absolute right-4 top-4 text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <Input
            type="search"
            placeholder="e.g. gym, stun, safe zone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-none border-4 border-neutral-900 font-mono text-base"
            autoFocus
          />
          <div className="mt-4">
            <SearchResults results={results} onSelect={() => setOpen(false)} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

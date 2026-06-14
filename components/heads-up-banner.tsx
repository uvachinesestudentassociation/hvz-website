"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { HEADS_UP_FOOTER, HEADS_UP_ITEMS } from "@/content/heads-up"

export function HeadsUpBanner() {
  const [visible, setVisible] = useState(true)

  const dismiss = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      id="heads-up"
      className={[
        "border-b-4 border-neutral-900 bg-rose-100",
        "pt-[env(safe-area-inset-top)] md:pt-0",
        "scroll-mt-24",
      ].join(" ")}
    >
      <div className="container mx-auto flex gap-3 px-4 py-3">
        <div className="min-w-0 flex-1 font-mono text-sm break-words">
          <p className="font-bold text-rose-800">Heads up! Latest rule tweaks:</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-neutral-900">
            {HEADS_UP_ITEMS.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-neutral-700">
            {HEADS_UP_FOOTER}{" "}
            <a href="/rules#heads-up" className="text-emerald-700 underline">
              See all
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss heads up banner"
          className="shrink-0 self-start p-2 text-neutral-700 hover:text-neutral-900"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

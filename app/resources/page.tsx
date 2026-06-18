import type { Metadata } from "next"
import { ResourceLinkCard } from "@/components/resource-link-card"
import Link from "next/link"
import { PIXEL_SECTION_BORDER, PIXEL_SECTION_PRIMARY, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { getSortedResources } from "@/lib/public-resources"

export const metadata: Metadata = {
  title: "Resources",
  description: "Points, population, graveyard, quest board, and report forms for CSA@UVA HvZ.",
}

export default function ResourcesPage() {
  const resources = getSortedResources(true)

  return (
    <section className={`border-b-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_PRIMARY}`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className={[
              `inline-flex min-h-[48px] items-center justify-center px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide`,
              `rounded-none border-4 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE} ${PIXEL_TEXT}`,
              "shadow-[4px_4px_0_rgba(0,0,0,0.45)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.08)] hover:translate-x-[1px] hover:translate-y-[1px]",
            ].join(" ")}
          >
            {"<< Back to Home"}
          </Link>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className={`font-mono text-3xl md:text-4xl font-black tracking-[0.18em] ${PIXEL_TEXT} drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)] dark:drop-shadow-[4px_4px_0_rgba(255,255,255,0.08)]`}>
            {">> PUBLIC HVZ RESOURCES"}
          </h1>
          <p className={`mt-4 font-mono text-base md:text-sm ${PIXEL_TEXT_MUTED} break-words`}>
            Everything you need to track points, report kills and quests, and stay informed throughout the game.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceLinkCard key={resource.label} resource={resource} variant="full" />
          ))}
        </div>
      </div>
    </section>
  )
}

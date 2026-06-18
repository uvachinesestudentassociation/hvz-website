import { ExternalLink } from "lucide-react"
import { THEME_COPY } from "@/content/theme"
import { PIXEL_SECTION_BORDER, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import type { PublicResource } from "@/lib/public-resources"

type MissingPosterCardProps = {
  graveyard: PublicResource
  population: PublicResource
  className?: string
}

export function MissingPosterCard({ graveyard, population, className = "" }: MissingPosterCardProps) {
  const { missingPoster } = THEME_COPY

  return (
    <a
      href={graveyard.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${missingPoster.headline}: ${missingPoster.subline}`}
      className={[
        `group relative block min-h-[48px] overflow-hidden rounded-none border-4 ${PIXEL_SECTION_BORDER}`,
        "bg-[#f4e8c8] text-[#2a2018] shadow-[6px_6px_0_rgba(0,0,0,0.45)]",
        "dark:border-[#5c4d3a] dark:bg-[#2a2420] dark:text-[#e8dfd0] dark:shadow-[6px_6px_0_rgba(0,0,0,0.55)]",
        "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)]",
        "dark:hover:shadow-[5px_5px_0_rgba(0,0,0,0.6)]",
        className,
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
        }}
        aria-hidden="true"
      />

      <div className="relative border-b-4 border-[#8b1a1a] bg-[#c41e1e] px-4 py-2 text-center dark:border-[#5c1515] dark:bg-[#3a1818]">
        <p className="missing-poster__headline">
          {missingPoster.headline}
        </p>
      </div>

      <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
        <div
          className={[
            "mx-auto flex size-24 shrink-0 items-center justify-center border-4 border-dashed border-[#8a7868]",
            "bg-[#e8dcc8]/80 font-mono text-5xl font-black text-[#6b5d4f]",
            "dark:border-[#5c4d3a] dark:bg-[#1e1814] dark:text-[#a89580]",
          ].join(" ")}
          aria-hidden="true"
        >
          ?
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="font-mono text-sm font-bold uppercase tracking-wide md:text-base">
            {missingPoster.subline}
          </p>
          <p className={`mt-2 font-mono text-xs ${PIXEL_TEXT_MUTED} md:text-sm`}>
            {graveyard.label} · {population.label}
          </p>
          <span
            className={[
              "mt-3 inline-block border-2 border-[#8a7868] bg-[#f5f0e6] px-3 py-1",
              "font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#5c4a38]",
              "dark:border-[#5c4d3a] dark:bg-[#1a1410] dark:text-amber-200",
            ].join(" ")}
          >
            {missingPoster.cta}
          </span>
        </div>
      </div>

      <ExternalLink
        className="absolute right-2 top-2 size-5 text-[#6b5d4f] opacity-70 dark:text-[#a89580]"
        aria-hidden="true"
      />
    </a>
  )
}

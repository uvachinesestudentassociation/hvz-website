import { ExternalLink } from "lucide-react"
import { ACTIVE_BOUNTY, BOUNTY_REVEALED } from "@/content/bounty"
import { getBountyDisplay } from "@/lib/bounty-display"
import { THEME_COPY } from "@/content/theme"
import { PIXEL_SECTION_BORDER, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"

type BountyCardProps = {
  className?: string
}

const POSTER_CLASS = [
  "relative overflow-hidden rounded-none border-4",
  PIXEL_SECTION_BORDER,
  "bg-[#f4e8c8] text-[#2a2018] shadow-[6px_6px_0_rgba(0,0,0,0.45)]",
  "dark:border-[#5c4d3a] dark:bg-[#2a2420] dark:text-[#e8dfd0] dark:shadow-[6px_6px_0_rgba(0,0,0,0.55)]",
].join(" ")

function PosterStripe() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
      }}
      aria-hidden="true"
    />
  )
}

function PosterHeadline({ text }: { text: string }) {
  return (
    <div className="relative border-b-4 border-[#8b1a1a] bg-[#c41e1e] px-4 py-2 text-center dark:border-[#5c1515] dark:bg-[#3a1818]">
      <p className="bounty-poster__headline">{text}</p>
    </div>
  )
}

function PlaceholderMark() {
  return (
    <div
      className={[
        "mx-auto flex size-28 shrink-0 items-center justify-center overflow-hidden border-4",
        "border-[#8a7868] bg-[#e8dcc8]/80",
        "dark:border-[#5c4d3a] dark:bg-[#1e1814]",
      ].join(" ")}
    >
      <span
        className="font-mono text-5xl font-black text-[#6b5d4f] dark:text-[#a89580]"
        aria-hidden="true"
      >
        ?
      </span>
    </div>
  )
}

export function BountyCard({ className = "" }: BountyCardProps) {
  const { bounty } = THEME_COPY
  const display = getBountyDisplay(ACTIVE_BOUNTY, BOUNTY_REVEALED)

  if (display.kind === "vacant") {
    return (
      <div className={[POSTER_CLASS, className].join(" ")} aria-label={bounty.vacant}>
        <PosterHeadline text={bounty.headline} />
        <p className={`p-5 text-center font-mono text-sm font-bold uppercase tracking-wide ${PIXEL_TEXT_MUTED}`}>
          {bounty.vacant}
        </p>
      </div>
    )
  }

  if (display.kind === "sealed") {
    return (
      <div
        className={[POSTER_CLASS, "min-h-[48px]", className].join(" ")}
        aria-label={`${bounty.headline}: ${bounty.sealed}`}
      >
        <PosterStripe />
        <PosterHeadline text={bounty.headline} />
        <div className="relative flex flex-col items-center gap-4 p-5">
          <PlaceholderMark />
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#5c4a38] dark:text-amber-200">
            {bounty.sealed}
          </p>
        </div>
      </div>
    )
  }

  const hasLink = Boolean(display.href)
  const Wrapper = hasLink ? "a" : "div"
  const linkProps = hasLink
    ? {
        href: display.href,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {}

  return (
    <Wrapper
      {...linkProps}
      aria-label={`${bounty.headline}: ${display.name} — ${display.reward}`}
      className={[
        POSTER_CLASS,
        "group block min-h-[48px]",
        hasLink
          ? "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)] dark:hover:shadow-[5px_5px_0_rgba(0,0,0,0.6)]"
          : "",
        className,
      ].join(" ")}
    >
      <PosterStripe />
      <PosterHeadline text={bounty.headline} />

      <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
        <div
          className={[
            "mx-auto flex size-28 shrink-0 items-center justify-center overflow-hidden border-4",
            "border-[#8a7868] bg-[#e8dcc8]/80",
            "dark:border-[#5c4d3a] dark:bg-[#1e1814]",
          ].join(" ")}
        >
          {display.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- local public asset path from content config
            <img
              src={display.imageSrc}
              alt={display.name}
              className="size-full object-cover grayscale contrast-125"
            />
          ) : (
            <span
              className="font-mono text-5xl font-black text-[#6b5d4f] dark:text-[#a89580]"
              aria-hidden="true"
            >
              ?
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="font-mono text-lg font-black uppercase tracking-[0.14em] md:text-xl">
            {display.name}
          </p>
          <p className="mt-1 font-mono text-sm font-bold uppercase tracking-wide text-[#8b1a1a] dark:text-red-300/90">
            {display.reward}
          </p>
          <p className={`mt-2 font-mono text-xs ${PIXEL_TEXT_MUTED} md:text-sm`}>
            {display.note ?? bounty.subline}
          </p>
          <span
            className={[
              "mt-3 inline-block border-2 border-[#8a7868] bg-[#f5f0e6] px-3 py-1",
              "font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#5c4a38]",
              "dark:border-[#5c4d3a] dark:bg-[#1a1410] dark:text-amber-200",
            ].join(" ")}
          >
            {bounty.cta}
          </span>
        </div>
      </div>

      {hasLink && (
        <ExternalLink
          className="absolute right-2 top-2 size-5 text-[#6b5d4f] opacity-70 dark:text-[#a89580]"
          aria-hidden="true"
        />
      )}
    </Wrapper>
  )
}

import { ExternalLink } from "lucide-react"
import { THEME } from "@/content/theme"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import type { LinkId } from "@/content/links"
import type { PublicResource } from "@/lib/public-resources"

type ResourceLinkCardProps = {
  resource: PublicResource
  variant?: "compact" | "full" | "action"
  className?: string
}

type ActionStyle = {
  card: string
  icon: string
  label: string
  badge: string
  badgeText: string
}

const DARK_DESK = {
  card: "dark:border-[#5c4d3a] dark:bg-[#2a2420] dark:shadow-[8px_8px_0_rgba(0,0,0,0.55)]",
  icon: "dark:border-[#5c4d3a] dark:bg-[#1e1814] dark:text-amber-200",
  label: "dark:text-[#e8dfd0]",
  badge: "dark:bg-[#1a1410] dark:text-amber-300",
}

const ACTION_STYLES: Partial<Record<LinkId, ActionStyle>> = {
  killReport: {
    card: `border-red-800 bg-red-700 shadow-[8px_8px_0_rgba(0,0,0,0.5)] ${DARK_DESK.card}`,
    icon: `border-red-950 bg-red-200 text-red-900 ${DARK_DESK.icon}`,
    label: `text-red-950 ${DARK_DESK.label}`,
    badge: `bg-red-900 text-red-50 ${DARK_DESK.badge}`,
    badgeText: "Report now",
  },
  questBoard: {
    card: `border-purple-800 bg-purple-700 shadow-[8px_8px_0_rgba(0,0,0,0.5)] ${DARK_DESK.card}`,
    icon: `border-purple-950 bg-purple-200 text-purple-900 ${DARK_DESK.icon}`,
    label: `text-purple-950 ${DARK_DESK.label}`,
    badge: `bg-purple-900 text-purple-50 ${DARK_DESK.badge}`,
    badgeText: "View board",
  },
  questReport: {
    card: `border-amber-800 bg-amber-600 shadow-[8px_8px_0_rgba(0,0,0,0.5)] ${DARK_DESK.card}`,
    icon: `border-amber-950 bg-amber-200 text-amber-900 ${DARK_DESK.icon}`,
    label: `text-amber-950 ${DARK_DESK.label}`,
    badge: `bg-amber-900 text-amber-50 ${DARK_DESK.badge}`,
    badgeText: "Report now",
  },
}

export function ResourceLinkCard({ resource, variant = "full", className = "" }: ResourceLinkCardProps) {
  const Icon = resource.icon
  const isAction = variant === "action"
  const actionStyle = ACTION_STYLES[resource.id]
  const isHighPriority = resource.priority === "high"

  return (
    <a
      href={resource.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={resource.description ? `${resource.label}: ${resource.description}` : resource.label}
      className={[
        `group relative block min-h-[48px] rounded-none border-4 ${PIXEL_SECTION_BORDER}`,
        isAction && actionStyle
          ? actionStyle.card
          : isHighPriority
            ? "border-[#8a7a68] bg-[#f5f0e6]/90 dark:border-[#5c4d3a] dark:bg-[#2f2922]/90"
            : PIXEL_SURFACE,
        isAction ? "p-5 md:p-6" : variant === "compact" ? "p-3 text-center" : "p-4 md:p-5 text-left",
        isAction
          ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] dark:hover:shadow-[6px_6px_0_rgba(0,0,0,0.6)] active:translate-x-[3px] active:translate-y-[3px]"
          : "shadow-[6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[6px_6px_0_rgba(0,0,0,0.55)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)] dark:hover:shadow-[5px_5px_0_rgba(0,0,0,0.6)]",
        "overflow-hidden [background-clip:padding-box]",
        className,
      ].join(" ")}
    >
      {isAction && actionStyle && (
        <span
          className={[
            "absolute left-0 top-0 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em]",
            actionStyle.badge,
          ].join(" ")}
        >
          {actionStyle.badgeText}
        </span>
      )}
      <div
        className={[
          "inline-flex shrink-0 items-center justify-center rounded-none border-4 [background-clip:padding-box]",
          isAction
            ? `mb-4 mt-5 size-14 ${actionStyle?.icon}`
            : variant === "compact"
              ? `mb-2 size-11 mx-auto ${PIXEL_SECTION_BORDER} bg-[#f0ebe3] dark:bg-[#1e1814]`
              : `mb-3 size-12 ${PIXEL_SECTION_BORDER} bg-[#f0ebe3] dark:bg-[#1e1814]`,
        ].join(" ")}
      >
        <Icon
          className={[
            "shrink-0",
            isAction ? "size-7" : `size-6 ${THEME.accent.link}`,
          ].join(" ")}
          aria-hidden="true"
          strokeWidth={2}
        />
      </div>
      <div
        className={[
          isAction
            ? `font-mono text-xl md:text-2xl font-black uppercase tracking-wide ${actionStyle?.label}`
            : `font-mono uppercase tracking-[0.18em] ${PIXEL_TEXT_SUBTLE}`,
          !isAction && (variant === "compact" ? "text-[10px]" : "text-xs"),
        ].join(" ")}
      >
        {resource.label}
      </div>
      {resource.description && (
        <div
          className={[
            isAction
              ? `mt-2 font-sans text-base font-semibold ${actionStyle?.label} opacity-90`
              : `mt-1 font-mono font-bold tracking-wide ${PIXEL_TEXT}`,
            !isAction && (variant === "compact" ? "text-xs" : "text-sm uppercase"),
          ].join(" ")}
        >
          {resource.description}
        </div>
      )}
      <ExternalLink
        className={[
          "absolute right-2 top-2 h-5 w-5",
          isAction ? `${PIXEL_TEXT} opacity-90` : `${PIXEL_TEXT_MUTED} opacity-70`,
        ].join(" ")}
        aria-hidden="true"
      />
    </a>
  )
}

import { ExternalLink } from "lucide-react"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import type { PublicResource } from "@/lib/public-resources"

type ResourceLinkCardProps = {
  resource: PublicResource
  variant?: "compact" | "full" | "action"
  className?: string
}

const ACTION_STYLES: Record<string, { card: string; icon: string; label: string; badge: string; badgeText: string }> = {
  "Kill Report": {
    card: "border-rose-700 bg-rose-500 shadow-[8px_8px_0_rgba(0,0,0,0.5)] dark:border-rose-900 dark:bg-rose-950 dark:shadow-[8px_8px_0_rgba(255,255,255,0.06)]",
    icon: "border-rose-900 bg-rose-200 text-rose-900 dark:border-rose-950 dark:bg-rose-900/70 dark:text-rose-200",
    label: "text-rose-950 dark:text-rose-100",
    badge: "bg-rose-900 text-rose-50 dark:bg-rose-950 dark:text-rose-100",
    badgeText: "Report now",
  },
  "Quest Board": {
    card: "border-emerald-700 bg-emerald-400 shadow-[8px_8px_0_rgba(0,0,0,0.5)] dark:border-emerald-900 dark:bg-emerald-950 dark:shadow-[8px_8px_0_rgba(255,255,255,0.06)]",
    icon: "border-emerald-900 bg-emerald-200 text-emerald-900 dark:border-emerald-950 dark:bg-emerald-900/70 dark:text-emerald-200",
    label: "text-emerald-950 dark:text-emerald-100",
    badge: "bg-emerald-900 text-emerald-50 dark:bg-emerald-950 dark:text-emerald-100",
    badgeText: "View board",
  },
  "Quest Report": {
    card: "border-amber-700 bg-amber-400 shadow-[8px_8px_0_rgba(0,0,0,0.5)] dark:border-amber-900 dark:bg-amber-950 dark:shadow-[8px_8px_0_rgba(255,255,255,0.06)]",
    icon: "border-amber-900 bg-amber-200 text-amber-900 dark:border-amber-950 dark:bg-amber-900/70 dark:text-amber-200",
    label: "text-amber-950 dark:text-amber-100",
    badge: "bg-amber-900 text-amber-50 dark:bg-amber-950 dark:text-amber-100",
    badgeText: "Report now",
  },
}

export function ResourceLinkCard({ resource, variant = "full", className = "" }: ResourceLinkCardProps) {
  const Icon = resource.icon
  const isAction = variant === "action"
  const actionStyle = ACTION_STYLES[resource.label]
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
            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
            : PIXEL_SURFACE,
        isAction ? "p-5 md:p-6" : variant === "compact" ? "p-3 text-center" : "p-4 md:p-5 text-left",
        isAction
          ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] dark:hover:shadow-[6px_6px_0_rgba(255,255,255,0.08)] active:translate-x-[3px] active:translate-y-[3px]"
          : "shadow-[6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[6px_6px_0_rgba(255,255,255,0.06)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)] dark:hover:shadow-[5px_5px_0_rgba(255,255,255,0.08)]",
        "overflow-hidden [background-clip:padding-box]",
        className,
      ].join(" ")}
    >
      {isAction && (
        <span
          className={[
            "absolute left-0 top-0 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em]",
            actionStyle?.badge,
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
              ? `mb-2 size-11 mx-auto ${PIXEL_SECTION_BORDER} bg-gray-100 dark:bg-neutral-800`
              : `mb-3 size-12 ${PIXEL_SECTION_BORDER} bg-gray-100 dark:bg-neutral-800`,
        ].join(" ")}
      >
        <Icon
          className={[
            "shrink-0",
            isAction ? "size-7" : "size-6 text-emerald-700 dark:text-emerald-400",
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

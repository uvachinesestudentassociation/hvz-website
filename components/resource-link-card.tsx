import { ExternalLink } from "lucide-react"
import { THEME } from "@/content/theme"
import { PIXEL_NAV_BG, PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import type { PublicResource } from "@/lib/public-resources"

type ResourceLinkCardProps = {
  resource: PublicResource
  variant?: "compact" | "full" | "action"
  className?: string
}

const ACTION_STYLES = {
  killReport: { ...THEME.actions.kill, badgeText: "Report now" },
  questBoard: { ...THEME.actions.questBoard, badgeText: "View board" },
  questReport: { ...THEME.actions.questReport, badgeText: "Report now" },
} as const

export function ResourceLinkCard({ resource, variant = "full", className = "" }: ResourceLinkCardProps) {
  const Icon = resource.icon
  const isAction = variant === "action"
  const actionStyle =
    resource.id === "killReport" || resource.id === "questBoard" || resource.id === "questReport"
      ? ACTION_STYLES[resource.id]
      : undefined
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
            ? PIXEL_SURFACE
            : PIXEL_SURFACE,
        isAction ? "flex items-center gap-3 p-4 md:block md:p-6" : variant === "compact" ? "p-3 text-center" : "p-4 md:p-5 text-left",
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
            "absolute left-0 top-0 hidden px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em] md:inline",
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
            ? `size-11 shrink-0 md:mb-4 md:mt-5 md:size-14 ${actionStyle?.icon}`
            : variant === "compact"
              ? `mb-2 size-11 mx-auto ${PIXEL_SECTION_BORDER} ${PIXEL_NAV_BG}`
              : `mb-3 size-12 ${PIXEL_SECTION_BORDER} ${PIXEL_NAV_BG}`,
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
      <div className={isAction ? "min-w-0 flex-1 pr-6" : undefined}>
        <div
          className={[
            isAction
              ? `font-mono text-lg font-black uppercase tracking-wide md:text-2xl ${actionStyle?.label}`
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
                ? `mt-0.5 font-sans text-sm font-semibold md:mt-2 md:text-base ${actionStyle?.label} opacity-90`
                : `mt-1 font-mono font-bold tracking-wide ${PIXEL_TEXT}`,
              !isAction && (variant === "compact" ? "text-xs" : "text-sm uppercase"),
            ].join(" ")}
          >
            {resource.description}
          </div>
        )}
      </div>
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

import { ExternalLink } from "lucide-react"
import type { PublicResource } from "@/lib/public-resources"

type ResourceLinkCardProps = {
  resource: PublicResource
  variant?: "compact" | "full" | "action"
}

const ACTION_STYLES: Record<string, { card: string; icon: string; label: string; badge: string }> = {
  "Kill Report": {
    card: "border-rose-700 bg-rose-500 shadow-[8px_8px_0_rgba(0,0,0,0.5)]",
    icon: "border-rose-900 bg-rose-200 text-rose-900",
    label: "text-rose-950",
    badge: "bg-rose-900 text-rose-50",
  },
  "Quest Report": {
    card: "border-amber-700 bg-amber-400 shadow-[8px_8px_0_rgba(0,0,0,0.5)]",
    icon: "border-amber-900 bg-amber-200 text-amber-900",
    label: "text-amber-950",
    badge: "bg-amber-900 text-amber-50",
  },
}

export function ResourceLinkCard({ resource, variant = "full" }: ResourceLinkCardProps) {
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
        "group relative block min-h-[48px] rounded-none border-4 border-neutral-900",
        isAction && actionStyle
          ? actionStyle.card
          : isHighPriority
            ? "border-emerald-600 bg-emerald-50"
            : "bg-white/80",
        isAction ? "p-5 md:p-6" : variant === "compact" ? "p-3 text-center" : "p-4 md:p-5 text-left",
        isAction
          ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)] active:translate-x-[3px] active:translate-y-[3px]"
          : "shadow-[6px_6px_0_rgba(0,0,0,0.45)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)]",
        "overflow-hidden [background-clip:padding-box]",
      ].join(" ")}
    >
      {isAction && (
        <span
          className={[
            "absolute left-0 top-0 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.2em]",
            actionStyle?.badge,
          ].join(" ")}
        >
          Report now
        </span>
      )}
      <div
        className={[
          "grid place-items-center rounded-none border-4 [background-clip:padding-box]",
          isAction
            ? `mb-4 mt-5 w-14 p-3 ${actionStyle?.icon}`
            : variant === "compact"
              ? "mb-2 p-2 mx-auto w-fit border-neutral-900 bg-gray-100"
              : "mb-3 w-12 p-3 border-neutral-900 bg-gray-100",
        ].join(" ")}
      >
        <Icon className={isAction ? "h-8 w-8" : "h-6 w-6 text-emerald-700"} aria-hidden="true" />
      </div>
      <div
        className={[
          isAction
            ? `font-mono text-xl md:text-2xl font-black uppercase tracking-wide ${actionStyle?.label}`
            : "font-mono uppercase tracking-[0.18em] text-neutral-600",
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
              : "mt-1 font-mono font-bold tracking-wide text-neutral-900",
            !isAction && (variant === "compact" ? "text-xs" : "text-sm uppercase"),
          ].join(" ")}
        >
          {resource.description}
        </div>
      )}
      <ExternalLink
        className={[
          "absolute right-2 top-2 h-5 w-5",
          isAction ? "text-neutral-900 opacity-90" : "text-neutral-700 opacity-70",
        ].join(" ")}
        aria-hidden="true"
      />
    </a>
  )
}

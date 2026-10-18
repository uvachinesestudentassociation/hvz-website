import { questBoardEmbedUrl } from "@/content/links"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import type { PublicResource } from "@/lib/public-resources"

const EMBED_FRAME = `relative aspect-video w-full overflow-hidden border-4 ${PIXEL_SECTION_BORDER}`
const EMBED_FRAME_THIN = "relative aspect-video w-full overflow-hidden border border-[var(--px-border)]"

export function QuestBoardEmbed({
  resource,
  frame = "thick",
}: {
  resource: PublicResource
  frame?: "thick" | "thin"
}) {
  const embedUrl = questBoardEmbedUrl(resource.href)
  const frameClass = frame === "thin" ? EMBED_FRAME_THIN : EMBED_FRAME
  if (!embedUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 px-4 text-center ${frameClass} ${PIXEL_SURFACE}`}
      >
        <p className={`font-mono text-lg font-bold uppercase tracking-wide ${PIXEL_TEXT}`}>{resource.label}</p>
        {resource.description && (
          <p className={`font-mono text-sm ${PIXEL_TEXT_MUTED}`}>{resource.description}</p>
        )}
      </div>
    )
  }

  return (
    <div className={frameClass}>
      <iframe
        src={embedUrl}
        title="Quest board"
        loading="lazy"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}

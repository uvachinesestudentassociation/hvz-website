import { questBoardEmbedUrl } from "@/content/links"
import { PIXEL_SECTION_BORDER, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"
import type { PublicResource } from "@/lib/public-resources"

const EMBED_FRAME = `h-[70dvh] w-full border-4 md:aspect-video md:h-auto ${PIXEL_SECTION_BORDER}`

export function QuestBoardEmbed({ resource }: { resource: PublicResource }) {
  const embedUrl = questBoardEmbedUrl(resource.href)
  if (!embedUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 px-4 text-center ${EMBED_FRAME} ${PIXEL_SURFACE}`}
      >
        <p className={`font-mono text-lg font-bold uppercase tracking-wide ${PIXEL_TEXT}`}>{resource.label}</p>
        {resource.description && (
          <p className={`font-mono text-sm ${PIXEL_TEXT_MUTED}`}>{resource.description}</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <iframe
        src={embedUrl}
        title="Quest board"
        loading="lazy"
        allowFullScreen
        className={`block ${EMBED_FRAME}`}
      />
      <a
        href={resource.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-3 inline-flex min-h-11 items-center font-mono text-sm font-bold underline ${THEME.accent.link}`}
      >
        {resource.label}
      </a>
    </div>
  )
}

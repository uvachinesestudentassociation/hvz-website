import { LINKS, questBoardEmbedUrl } from "@/content/links"
import { PIXEL_SECTION_BORDER } from "@/components/hvz/pixel-styles"

const EMBED_FRAME = `h-[min(70dvh,40rem)] w-full border-4 ${PIXEL_SECTION_BORDER}`
const EMBED_FRAME_THIN = "h-[min(70dvh,40rem)] w-full border border-[var(--px-border)]"

export function QuestBoardEmbed({
  href = LINKS.questBoard,
  frame = "thick",
}: {
  href?: string
  frame?: "thick" | "thin"
}) {
  const src = questBoardEmbedUrl(href || LINKS.questBoard)
  if (!src) return null
  const frameClass = frame === "thin" ? EMBED_FRAME_THIN : EMBED_FRAME
  return <iframe title="Quest board" src={src} className={`block ${frameClass}`} />
}

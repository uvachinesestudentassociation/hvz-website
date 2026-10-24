import { resourceEmbedUrl } from "@/content/links"

/** Published Google Form. storage-access lets a signed-in Google session load inside the frame. */
export function FormEmbed({ label, href }: { label: string; href: string }) {
  const src = resourceEmbedUrl(href)
  if (!src?.includes("/forms/") || !src.includes("viewform")) return null
  return (
    <iframe
      title={label}
      src={src}
      allow="storage-access"
      className="h-[60dvh] w-full border bg-white"
    />
  )
}

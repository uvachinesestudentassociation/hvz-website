import { PixelDisclosure } from "@/components/hvz/pixel-disclosure"
import { PIXEL_SECTION_BORDER, PIXEL_SECTION_EMERALD, PIXEL_TEXT, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import { PageToc } from "@/components/page-toc"
import { SAFE_ZONE_SECTIONS, SAFE_ZONES_TOC } from "@/content/safe-zones"

export function SafeZonesContent() {
  return (
    <section id="safe-zones" className={`scroll-mt-24 border-b-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_EMERALD}`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className={`text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider ${PIXEL_TEXT}`}>
            {">> SAFE ZONES"}
          </h1>

          <PageToc items={SAFE_ZONES_TOC} />

          <div className="space-y-4">
            {SAFE_ZONE_SECTIONS.map((zone) => (
              <PixelDisclosure key={zone.id} id={zone.id} title={zone.title}>
                {zone.paragraphs.map((p) => (
                  <p key={p} className="break-words">
                    {p.includes("NO BRAIN-EATING") ? (
                      <span className="font-bold text-rose-700">{p}</span>
                    ) : p.includes("RESPECT PRIVACY") ? (
                      <span className="font-bold text-rose-700">{p}</span>
                    ) : (
                      p
                    )}
                  </p>
                ))}
                {zone.listItems && (
                  <ul className="space-y-2 pl-4">
                    {zone.listItems.map((item) => (
                      <li key={item} className="flex gap-2 break-words">
                        <span className="text-emerald-700 dark:text-emerald-400">{"•"}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {zone.footnote && (
                  <p className={`text-xs ${PIXEL_TEXT_SUBTLE} break-words`}>{zone.footnote}</p>
                )}
              </PixelDisclosure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

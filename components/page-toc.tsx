import { PIXEL_FRAME, PIXEL_SECTION_BORDER, PIXEL_TEXT, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"

type TocItem = {
  id: string
  label: string
}

export function PageToc({ items, title = "Jump to section" }: { items: TocItem[]; title?: string }) {
  return (
    <nav aria-label={title} className={`${PIXEL_FRAME} p-4 md:hidden`}>
      <p className={`mb-3 font-mono text-xs font-bold uppercase tracking-wider ${PIXEL_TEXT_SUBTLE}`}>
        {`>> ${title}`}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                "inline-block min-h-[44px] px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide",
                `rounded-none border-2 ${PIXEL_SECTION_BORDER} bg-emerald-500/10 dark:bg-emerald-500/20 ${PIXEL_TEXT}`,
                "hover:bg-emerald-500/20 active:translate-x-[1px] active:translate-y-[1px]",
              ].join(" ")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

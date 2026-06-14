type TocItem = {
  id: string
  label: string
}

export function PageToc({ items, title = "Jump to section" }: { items: TocItem[]; title?: string }) {
  return (
    <nav aria-label={title} className="rounded-none border-4 border-neutral-900 bg-white/70 p-4">
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-600">
        {`>> ${title}`}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                "inline-block min-h-[44px] px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide",
                "rounded-none border-2 border-neutral-900 bg-emerald-500/10 text-neutral-900",
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

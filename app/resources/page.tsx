import { PUBLIC_RESOURCES } from "@/lib/public-resources"
import { ExternalLink } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div
      className={[
        "min-h-screen",
        "bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:24px_24px]",
      ].join(" ")}
    >
      <section className="border-b-8 border-neutral-900 bg-emerald-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mb-8 flex justify-center">
            <a
              href="/"
              className={[
                "inline-flex items-center justify-center px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide",
                "rounded-none border-4 border-neutral-900 bg-white/80 text-neutral-900",
                "shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_rgba(0,0,0,0.45)]",
              ].join(" ")}
            >
              {"<< Back to Home"}
            </a>
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-mono text-3xl md:text-4xl font-black tracking-[0.18em] text-neutral-900 drop-shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
              {">> PUBLIC HVZ RESOURCES"}
            </h1>
            <p className="mt-4 font-mono text-sm text-neutral-800">
              Everything you need to track points, report kills and quests, and stay informed throughout the game.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PUBLIC_RESOURCES.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={`${link.label}-${link.title}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label}: ${link.title}`}
                  className={[
                    "group relative block rounded-none border-4 border-neutral-900 bg-white/80 p-5 text-left",
                    "shadow-[6px_6px_0_rgba(0,0,0,0.45)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)]",
                    "overflow-hidden [background-clip:padding-box]",
                  ].join(" ")}
                >
                  <div className="mb-3 grid w-12 place-items-center rounded-none border-4 border-neutral-900 bg-gray-100 p-3 [background-clip:padding-box]">
                    <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">{link.label}</div>
                  <div className="mt-2 font-mono text-sm font-bold uppercase tracking-wide text-neutral-900">
                    {link.title}
                  </div>
                  <ExternalLink
                    className="absolute right-2 top-2 h-4 w-4 text-neutral-700 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

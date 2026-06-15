import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"
import { JoinGameButton } from "@/components/join-game-button"
import { ResourceLinkCard } from "@/components/resource-link-card"
import { getSortedResources, PUBLIC_RESOURCES } from "@/lib/public-resources"
import { SITE_CONFIG } from "@/lib/site-config"

function getHomeQuickActions() {
  const killReport = PUBLIC_RESOURCES.find((r) => r.label === "Kill Report")!
  const questBoard = PUBLIC_RESOURCES.find((r) => r.label === "Quest Board")!
  const questReport = PUBLIC_RESOURCES.find((r) => r.label === "Quest Report")!
  return { killReport, questBoard, questReport }
}

export default function HomePage() {
  const { killReport, questBoard, questReport } = getHomeQuickActions()
  const otherResources = getSortedResources(true).filter((r) => r.priority !== "high" && r.label !== "Quest Board").slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-8 border-neutral-900">
        <div className="absolute inset-0 bg-[linear-gradient(#7ec8e3,rgba(126,200,227,0.85))]" />
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,0.15)_8px,transparent_8px),linear-gradient(rgba(255,255,255,0.12)_8px,transparent_8px)] bg-[size:64px_64px]" />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-600 shadow-[0_-6px_0_rgba(0,0,0,0.35)_inset]" />
        <div className="absolute -bottom-6 left-0 right-0 h-6 bg-amber-800 shadow-[0_6px_0_rgba(0,0,0,0.35)_inset]" />

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 font-mono text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.04em] md:tracking-[0.08em] text-neutral-900 drop-shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
              HUMANS VS. ZOMBIES
            </h1>
            <p className="mx-auto mb-8 max-w-xl font-mono text-base md:text-lg text-neutral-800 bg-white/40 px-3 py-2 rounded-none border-4 border-neutral-900 shadow-[4px_4px_0_rgba(0,0,0,0.4)] break-words">
              {SITE_CONFIG.tagline}
            </p>
            <GameCountdown />
            <div className="flex flex-wrap justify-center gap-4">
              <JoinGameButton />
            </div>
          </div>
        </div>
      </section>

      {/* Quick resources */}
      <section id="resources" className="scroll-mt-24 border-b-8 border-neutral-900 bg-emerald-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="mb-4 text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
            {">> QUICK LINKS"}
          </h2>
          <p className="mb-6 text-center font-mono text-sm text-neutral-700">
            Submit kills and quests right away — standings and more on the{" "}
            <Link href="/resources" className="text-emerald-700 underline">
              resources page
            </Link>
            .
          </p>

          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            <ResourceLinkCard resource={killReport} variant="action" />
            <ResourceLinkCard resource={questReport} variant="action" />
            <ResourceLinkCard resource={questBoard} variant="action" className="sm:col-span-2" />
          </div>

          <h3 className="mb-4 text-center font-mono text-sm font-bold uppercase tracking-wider text-neutral-600">
            {">> Also check"}
          </h3>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
            {otherResources.map((resource) => (
              <ResourceLinkCard key={resource.label} resource={resource} variant="full" />
            ))}
          </div>
        </div>
      </section>

      {/* Deep links */}
      <section className="border-b-8 border-neutral-900 bg-amber-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="mb-8 text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
            {">> EXPLORE"}
          </h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { href: "/rules", label: "Game Rules", desc: "Basic rules, specific rules, and things to note" },
              { href: "/safe-zones", label: "Safe Zones", desc: "Residences, classes, gym, CSA events, and more" },
              { href: "/resources", label: "All Resources", desc: "Points, population, graveyard, quest board, forms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "block min-h-[48px] rounded-none border-4 border-neutral-900 bg-white/80 p-5",
                  "shadow-[6px_6px_0_rgba(0,0,0,0.45)] hover:translate-x-[1px] hover:translate-y-[1px]",
                ].join(" ")}
              >
                <div className="font-mono text-lg font-bold text-emerald-700">{link.label}</div>
                <div className="mt-2 font-mono text-sm text-neutral-700 break-words">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

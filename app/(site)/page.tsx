import Link from "next/link"
import { GameCountdown } from "@/components/game-countdown"
import { HeroBackground } from "@/components/hero-background"
import { HeroLogo } from "@/components/hero-logo"
import { BountyCard } from "@/components/bounty-card"
import { NightShiftSectionHeader } from "@/components/night-shift-section-header"
import { QuestBoardEmbed } from "@/components/quest-board-embed"
import { ResourceLinkCard } from "@/components/resource-link-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { THEME, THEME_COPY } from "@/content/theme"
import { PIXEL_HERO_SURFACE, PIXEL_SECTION_BORDER, PIXEL_SECTION_PRIMARY, PIXEL_SECTION_SECONDARY, PIXEL_SURFACE, PIXEL_TEXT, PIXEL_TEXT_MUTED, PIXEL_TEXT_SUBTLE, PIXEL_STAMP, DESK_RING, DESK_TILT } from "@/components/hvz/pixel-styles"
import { getResource, getSortedResources } from "@/lib/public-resources"
import { SITE_CONFIG } from "@/lib/site-config"

function getHomeQuickActions() {
  return {
    killReport: getResource("killReport"),
    questBoard: getResource("questBoard"),
    questReport: getResource("questReport"),
  }
}

export default function HomePage() {
  const { killReport, questBoard, questReport } = getHomeQuickActions()
  const otherResources = getSortedResources()
    .filter((r) => r.priority !== "high" && r.id !== "questBoard")
    .slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className={`hero-crt relative overflow-hidden border-b-8 ${PIXEL_SECTION_BORDER}`}>
        <HeroBackground />

        <div className="container relative mx-auto px-4 py-6 md:py-12">
          <div className="mx-auto max-w-4xl text-center">
            <HeroLogo />
            <p className={`mx-auto mb-8 max-w-xl text-balance font-mono text-base md:text-lg ${PIXEL_TEXT_MUTED} ${PIXEL_HERO_SURFACE} px-3 py-2 rounded-none border-4 ${PIXEL_SECTION_BORDER} ${PIXEL_STAMP} break-words`}>
              {SITE_CONFIG.tagline}
            </p>
            <GameCountdown />
          </div>
        </div>
      </section>

      {/* Quick resources */}
      <section id="resources" className={`scroll-mt-24 border-b-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_PRIMARY}`}>
        <div className="container mx-auto px-4 pt-8 pb-4 md:pt-16 md:pb-6">
          <ScrollReveal>
            <NightShiftSectionHeader>
              {THEME_COPY.sections.quickLinks}
            </NightShiftSectionHeader>
            <p className={`mb-6 text-center font-mono text-sm ${PIXEL_TEXT_MUTED}`}>
              Submit kills and quests right away — standings and more on the{" "}
              <Link href="/resources" className={`${THEME.accent.linkUnderline}`}>
                resources page
              </Link>
              .
            </p>
          </ScrollReveal>

          <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            <ScrollReveal delay={0}>
              <ResourceLinkCard resource={killReport} variant="action" className={DESK_TILT.left} />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <ResourceLinkCard resource={questReport} variant="action" className={DESK_TILT.right} />
            </ScrollReveal>
            <ScrollReveal delay={240} className="sm:col-span-2">
              <QuestBoardEmbed resource={questBoard} />
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <h3 className={`mb-4 text-center font-mono text-sm font-bold uppercase tracking-wider ${PIXEL_TEXT_SUBTLE}`}>
              {THEME_COPY.sections.alsoCheck}
            </h3>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="mx-auto mb-4 max-w-5xl">
              <BountyCard className={DESK_TILT.left} />
            </div>
          </ScrollReveal>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
            {otherResources.map((resource, index) => (
              <ScrollReveal key={resource.label} delay={index * 120}>
                <ResourceLinkCard
                  resource={resource}
                  variant="full"
                  className={[
                    index === 0 ? DESK_RING.br : "",
                    index === 1 ? DESK_TILT.right : "",
                  ].filter(Boolean).join(" ") || undefined}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deep links */}
      <section className={`hidden border-b-8 md:block ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_SECONDARY}`}>
        <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
          <ScrollReveal>
            <h2 className={`mb-8 text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider ${PIXEL_TEXT}`}>
              {THEME_COPY.sections.explore}
            </h2>
          </ScrollReveal>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { href: "/rules", label: "Game Rules", desc: "Basic rules, specific rules, and things to note" },
              { href: "/safe-zones", label: "Safe Zones", desc: "Residences, classes, gym, CSA events, and more" },
              { href: "/resources", label: "All Resources", desc: "Points, population, graveyard, quest board, forms" },
            ].map((link, index) => (
              <ScrollReveal key={link.href} delay={Math.min(index, 2) * 120}>
                <Link
                  href={link.href}
                  className={[
                    `block min-h-[48px] rounded-none border-4 ${PIXEL_SECTION_BORDER} ${PIXEL_SURFACE} p-5`,
                    index === 1 ? DESK_RING.tr : "",
                    index === 0 ? DESK_TILT.right : "",
                    index === 2 ? DESK_TILT.left : "",
                    "shadow-[6px_6px_0_rgba(0,0,0,0.45)] dark:shadow-[6px_6px_0_rgba(0,0,0,0.55)] hover:translate-x-[1px] hover:translate-y-[1px]",
                  ].join(" ")}
                >
                  <div className={`font-mono text-lg font-bold ${THEME.accent.link}`}>{link.label}</div>
                  <div className={`mt-2 font-mono text-sm ${PIXEL_TEXT_MUTED} break-words`}>{link.desc}</div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

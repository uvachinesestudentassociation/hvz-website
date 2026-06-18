import Link from "next/link"
import { BlockPanel } from "@/components/hvz/block-panel"
import { PixelDisclosure } from "@/components/hvz/pixel-disclosure"
import { PIXEL_SECTION_BORDER, PIXEL_SECTION_SECONDARY, PIXEL_TEXT, PIXEL_TEXT_SUBTLE } from "@/components/hvz/pixel-styles"
import { THEME } from "@/content/theme"
import { PageToc } from "@/components/page-toc"
import {
  BASIC_RULES_INTRO,
  BASIC_RULES_SUBSECTIONS,
  RULES_TOC,
  getSpecificRulesByTone,
} from "@/content/rules"
import { THINGS_TO_NOTE } from "@/content/things-to-note"
import { SITE_CONFIG } from "@/lib/site-config"

const toneBorder: Record<string, string> = {
  rose: "border-rose-600 bg-rose-100/50 dark:border-amber-900/40 dark:bg-[#2a2018]/60",
  emerald: "border-[#8a7a68] bg-[#e8dcc8]/50 dark:border-[#5c4d3a] dark:bg-[#2f2922]/60",
  amber: "border-amber-700 bg-amber-100/50 dark:border-amber-900/40 dark:bg-[#2a2218]/60",
  sky: "border-sky-700 bg-sky-100/50 dark:border-[#5c4d3a] dark:bg-[#2a2420]/60",
}

const toneText: Record<string, string> = {
  rose: "text-rose-700 dark:text-amber-300/90",
  emerald: `${THEME.accent.link}`,
  amber: "text-amber-800 dark:text-amber-300/90",
  sky: "text-sky-800 dark:text-green-400/80",
}

export function RulesContent() {
  return (
    <section id="rules" className={`scroll-mt-24 border-b-8 ${PIXEL_SECTION_BORDER} ${PIXEL_SECTION_SECONDARY}`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className={`text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider ${PIXEL_TEXT}`}>
            {">> GAME RULES"}
          </h1>

          <PageToc items={RULES_TOC} />

          <div id="things-to-note" className="scroll-mt-24">
            <BlockPanel title={<span className="text-rose-700 dark:text-amber-300/90">⚠ THINGS TO NOTE</span>} tone="danger">
              <p className="font-bold text-rose-700 dark:text-amber-300/90">{THINGS_TO_NOTE.warning}</p>
              <br />
              {THINGS_TO_NOTE.paragraphs.map((p) => (
                <p key={p} className="break-words">
                  {p.includes(SITE_CONFIG.contactEmail) ? (
                    <>
                      Any concerns and questions should be addressed to our email at{" "}
                      <a href={`mailto:${SITE_CONFIG.contactEmail}`} className={`${THEME.accent.linkUnderline} break-all`}>
                        {SITE_CONFIG.contactEmail}
                      </a>
                    </>
                  ) : (
                    p
                  )}
                  <br />
                  <br />
                </p>
              ))}
              <p className="font-bold text-lg text-rose-700 dark:text-amber-300/90 text-center">{THINGS_TO_NOTE.honorCode}</p>
            </BlockPanel>
          </div>

          <div className="space-y-4">
            <PixelDisclosure id="basic-rules" title={">> BASIC RULES"}>
              <p className="break-words">
                Each family will start with <span className="font-bold">THREE</span> zombies.
              </p>
              {BASIC_RULES_INTRO.slice(1).map((p) => (
                <p key={p} className="break-words">
                  {p}
                </p>
              ))}

              {BASIC_RULES_SUBSECTIONS.map((sub) => (
                <div
                  key={sub.id}
                  id={sub.id}
                  className={`scroll-mt-24 border-l-4 p-4 ${toneBorder[sub.tone]}`}
                >
                  <h3 className={`mb-3 font-mono text-lg font-bold ${toneText[sub.tone]}`}>{sub.heading}</h3>
                  {sub.paragraphs?.map((p) => (
                    <p key={p} className="mb-2 break-words">
                      {p.includes("RESPECT PRIVACY") ? (
                        <>
                          Humans cannot be killed in the safe zones below. Read carefully to understand how they work.
                          <span className="block font-bold text-rose-700 dark:text-amber-300/90">
                            RESPECT PRIVACY AND DO NOT DISTURB EXTERNAL MEETINGS/ORGS. If we see/hear breaches, you may
                            be removed from HvZ and your family may face consequences.
                          </span>
                        </>
                      ) : (
                        p
                      )}
                    </p>
                  ))}
                  {sub.items && (
                    <ul className="space-y-2">
                      {sub.items.map((t) => (
                        <li key={t} className="flex gap-2 break-words">
                          <span className={toneText[sub.tone]}>{">"}</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sub.id === "safe-zones-summary" && (
                    <>
                      <p className={`mt-2 ${PIXEL_TEXT}`}>
                        Being in a safe zone just means zombies can&apos;t tag you. You can still stun them.
                      </p>
                      <p className="mt-2 italic">
                        More details on{" "}
                        <Link href="/safe-zones" className={THEME.accent.linkUnderline}>
                          Safe Zones
                        </Link>
                        .
                      </p>
                    </>
                  )}
                  {sub.id === "quests" && (
                    <div className="mt-3 space-y-3">
                      <div className="border-l-4 border-[#8a7a68] bg-[#e8dcc8]/40 p-3">
                        <p className={`font-mono text-sm font-bold ${THEME.accent.link}`}>
                          Quest points are given to the first family to complete the quest unless stated otherwise.
                        </p>
                      </div>
                      <div className="border-l-4 border-[#8a7a68] bg-[#e8dcc8]/40 p-3">
                        <p className={`font-mono text-sm font-bold ${THEME.accent.link}`}>
                          You are not safe while completing quests unless stated otherwise.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </PixelDisclosure>

            <PixelDisclosure id="specific-rules" title={">> SPECIFIC RULES"}>
              <div className="space-y-3">
                {getSpecificRulesByTone().map((rule) => (
                  <div
                    key={rule.id}
                    id={rule.id}
                    className={`scroll-mt-24 border-l-4 p-4 ${toneBorder[rule.tone]}`}
                  >
                    <h3 className={`mb-2 font-bold ${toneText[rule.tone]}`}>{rule.heading}</h3>
                    <p className="break-words">{rule.body}</p>
                    {rule.footnote && (
                      <p className={`mt-1 text-xs ${PIXEL_TEXT_SUBTLE} break-words`}>{rule.footnote}</p>
                    )}
                  </div>
                ))}
              </div>
            </PixelDisclosure>
          </div>
        </div>
      </div>
    </section>
  )
}

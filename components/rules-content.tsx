import Link from "next/link"
import { BlockPanel } from "@/components/hvz/block-panel"
import { PixelDisclosure } from "@/components/hvz/pixel-disclosure"
import { PageToc } from "@/components/page-toc"
import { HEADS_UP_FOOTER, HEADS_UP_ITEMS } from "@/content/heads-up"
import {
  BASIC_RULES_INTRO,
  BASIC_RULES_SUBSECTIONS,
  RULES_TOC,
  SPECIFIC_RULES,
} from "@/content/rules"
import { THINGS_TO_NOTE } from "@/content/things-to-note"
import { SITE_CONFIG } from "@/lib/site-config"

const toneBorder: Record<string, string> = {
  rose: "border-rose-600 bg-rose-500/10",
  emerald: "border-emerald-600 bg-emerald-500/10",
  amber: "border-amber-700 bg-amber-500/10",
  sky: "border-sky-700 bg-sky-500/10",
}

const toneText: Record<string, string> = {
  rose: "text-rose-700",
  emerald: "text-emerald-700",
  amber: "text-amber-800",
  sky: "text-sky-800",
}

export function RulesContent() {
  return (
    <section id="rules" className="scroll-mt-24 border-b-8 border-neutral-900 bg-amber-900/10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
            {">> GAME RULES"}
          </h1>

          <PageToc items={RULES_TOC} />

          <div id="heads-up" className="scroll-mt-24">
            <BlockPanel title={<span className="text-rose-700">Heads up!</span>} tone="danger">
              <div className="space-y-2 pb-2">
                <p className="text-rose-700 font-semibold">Latest tweaks you should know about:</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-rose-700 text-neutral-900">
                  {HEADS_UP_ITEMS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>{HEADS_UP_FOOTER}</p>
              </div>
            </BlockPanel>
          </div>

          <div id="things-to-note" className="scroll-mt-24">
            <BlockPanel title={<span className="text-rose-700">⚠ THINGS TO NOTE</span>} tone="danger">
              <p className="font-bold text-rose-700">{THINGS_TO_NOTE.warning}</p>
              <br />
              {THINGS_TO_NOTE.paragraphs.map((p) => (
                <p key={p} className="break-words">
                  {p.includes(SITE_CONFIG.contactEmail) ? (
                    <>
                      Any concerns and questions should be addressed to our email at{" "}
                      <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="text-emerald-700 underline break-all">
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
              <p className="font-bold text-lg text-rose-700 text-center">{THINGS_TO_NOTE.honorCode}</p>
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
                          <span className="block font-bold text-rose-700">
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
                      <p className="mt-2 text-neutral-900">
                        Being in a safe zone just means zombies can&apos;t tag you. You can still stun them.
                      </p>
                      <p className="mt-2 italic">
                        More details on{" "}
                        <Link href="/safe-zones" className="text-emerald-700 underline">
                          Safe Zones
                        </Link>
                        .
                      </p>
                    </>
                  )}
                  {sub.id === "quests" && (
                    <div className="mt-3 space-y-3">
                      <div className="border-l-4 border-emerald-700 bg-emerald-500/20 p-3">
                        <p className="font-mono text-sm font-bold text-emerald-800">
                          Quest points are given to the first family to complete the quest unless stated otherwise.
                        </p>
                      </div>
                      <div className="border-l-4 border-emerald-700 bg-emerald-500/20 p-3">
                        <p className="font-mono text-sm font-bold text-emerald-800">
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
                {SPECIFIC_RULES.map((rule) => (
                  <div
                    key={rule.id}
                    id={rule.id}
                    className={`scroll-mt-24 border-l-4 p-4 ${toneBorder[rule.tone]}`}
                  >
                    <h3 className={`mb-2 font-bold ${toneText[rule.tone]}`}>{rule.heading}</h3>
                    <p className="break-words">{rule.body}</p>
                    {rule.footnote && (
                      <p className="mt-1 text-xs text-neutral-600 break-words">{rule.footnote}</p>
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

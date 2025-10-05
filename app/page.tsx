import { CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ExternalLink,
  Users,
  Skull,
  FileText,
  Scroll,
  Target,
  Shield,
} from "lucide-react";

/**
 * HvZPage – Minecraft-themed UI pass
 * - Blocky (pixel) borders, chunky shadows, and inventory-slot quick links
 * - Always-on "Things to Note" moved out of accordion
 * - Sky/grass/dirt sectional backgrounds using pure CSS gradients (no extra assets)
 * - Optional: If you add a pixel font (e.g., "Press Start 2P") in your app, swap font classes below
 */

function McButton({
  children,
  className = "",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={[
        // blocky button with bevel
        "rounded-none border-4 border-neutral-900 bg-emerald-500",
        "shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.4),inset_4px_4px_0_0_rgba(255,255,255,0.25),6px_6px_0_0_rgba(0,0,0,0.45)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.45),inset_4px_4px_0_0_rgba(255,255,255,0.2),4px_4px_0_0_rgba(0,0,0,0.45)]",
        "font-mono tracking-tight uppercase",
        className,
      ].join(" ")}
    >
      {children}
    </Button>
  );
}

function BlockPanel({
  title,
  tone = "primary", // "primary" | "danger" | "stone"
  className = "",
  children,
}: {
  title?: React.ReactNode;
  tone?: "primary" | "danger" | "stone";
  className?: string;
  children: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    primary: "border-emerald-600 bg-emerald-500/10",
    danger: "border-rose-600 bg-rose-500/10",
    stone: "border-stone-600 bg-stone-500/10",
  };
  return (
    <div
      className={[
        "rounded-none border-4 ",
        toneMap[tone],
        // thick pixel shadow frame
        "shadow-[8px_8px_0_0_rgba(0,0,0,0.4)]",
        className,
      ].join(" ")}
    >
      {title && (
        <div className="border-b-4 border-neutral-900 bg-black/10 px-4 py-3">
          <CardTitle className="font-mono text-xl md:text-2xl tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {title}
          </CardTitle>
        </div>
      )}
      <CardContent className="pt-6 font-mono text-sm leading-relaxed">
        {children}
      </CardContent>
    </div>
  );
}

export default function HvZPage() {
  const externalLinks = [
    { name: "Points", href: "#", icon: Target },
    { name: "Population List", href: "#", icon: Users },
    { name: "Graveyard", href: "#", icon: Skull },
    { name: "Kill Report Form", href: "#", icon: FileText },
    { name: "Quest List", href: "#", icon: Scroll },
    { name: "Quest Form", href: "#", icon: FileText },
  ];

  return (
    <div
      className={[
        "min-h-screen",
        // subtle cobblestone tiling using layered gradients (pure CSS)
        "bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:24px_24px]",
      ].join(" ")}
    >
      {/* Hero: sky -> grass top -> dirt stripe */}
      <section className="relative overflow-hidden border-b-8 border-neutral-900">
        {/* Sky */}
        <div className="absolute inset-0 bg-[linear-gradient(#7ec8e3,rgba(126,200,227,0.85))]" />
        {/* Blocky clouds */}
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(90deg,rgba(255,255,255,0.15)_8px,transparent_8px),linear-gradient(rgba(255,255,255,0.12)_8px,transparent_8px)] bg-[size:64px_64px]" />
        {/* Grass cap */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-600 shadow-[0_-6px_0_0_rgba(0,0,0,0.35)_inset]" />
        {/* Dirt */}
        <div className="absolute -bottom-6 left-0 right-0 h-6 bg-amber-800 shadow-[0_6px_0_0_rgba(0,0,0,0.35)_inset]" />

        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative h-48 w-48 md:h-64 md:w-64">
                <img
                  src="/minecraft-style-zombie-and-human-pixel-art.png"
                  alt="HvZ Game Logo"
                  className="h-full w-full object-contain [image-rendering:pixelated]"
                />
              </div>
            </div>
            <h1 className="mb-4 font-mono text-4xl md:text-6xl lg:text-7xl font-black tracking-[0.08em] text-neutral-900 drop-shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
              HUMANS VS. ZOMBIES
            </h1>
            <p className="mx-auto mb-8 max-w-xl font-mono text-base md:text-lg text-neutral-800 bg-white/40 px-3 py-2 rounded-none border-4 border-neutral-900 shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
              {
                "Survive the night. Complete quests. Bring honor to your family."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <McButton size="lg">Join the Game</McButton>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory / Quick Links */}
      <section className="border-b-8 border-neutral-900 bg-emerald-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="mb-8 text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
            {">> GAME RESOURCES"}
          </h2>

          {/* Inventory bar style grid */}
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {externalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={[
                    "group relative block rounded-none border-4 border-neutral-900 bg-white/70 p-3 text-center",
                    "shadow-[6px_6px_0_rgba(0,0,0,0.45)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.45)]",
                  ].join(" ")}
                >
                  <div className="mb-2 grid place-items-center rounded-none border-4 border-neutral-900 bg-gray-100 p-2 [image-rendering:pixelated]">
                    <Icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div className="font-mono text-xs font-bold tracking-wide text-neutral-900">
                    {link.name}
                  </div>
                  <ExternalLink className="absolute right-1 top-1 h-4 w-4 text-neutral-700 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="border-b-8 border-neutral-900 bg-amber-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
              {">> GAME RULES"}
            </h2>

            {/* Always-visible Things to Note */}
            <BlockPanel
              title={<span className="text-rose-700">⚠ THINGS TO NOTE</span>}
              tone="danger"
            >
              <p className="font-bold text-rose-700">
                There is no due process of law. Community Chairs are judge,
                jury, and executioner. All of our decisions are FINAL. Please do
                NOT argue with us. Excessive debating, arguing, and attacking
                may be subject to point deductions from your respective
                families. We reserve the right to adjust points as we see fit.
                Again, this is a dictatorship, not a democracy.
              </p>
              <br></br>
              <p>
                Read ALL of the rules in their entirety before contacting us.
                Not only is this page essential to understand how HvZ works, but
                also if you contact us with an issue that is very clearly
                outlined on this site we reserve the right to deduct points for
                wasting time.
              </p>
              <br></br>
              <p>
                Use common sense. Do NOT put other people in danger and do not
                put yourself in danger. This is meant to be a fun experience for
                everyone so please be smart about yours and others' safety.
              </p>
              <br></br>
              <p>
                Any concerns and questions should be addressed to our email at{" "}
                <a
                  href="mailto:community.csa@gmail.com"
                  className="text-emerald-700 underline"
                >
                  community.csa@gmail.com
                </a>
              </p>
              <br></br>
              <p>
                If any edits get made to this site throughout the game, we will
                also update in the HvZ facebook group.
              </p>
              <br></br>
              <p className="font-bold text-lg text-rose-700 text-center">
                HONOR CODE APPLIES.
              </p>
              <br></br>
            </BlockPanel>

            {/* Collapsible rule groups */}
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem
                value="basic-rules"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-2xl text-emerald-700">
                    {">> BASIC RULES"}
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-6 font-mono text-sm leading-relaxed">
                    <p>
                      Each family will start with{" "}
                      <span className="font-bold">THREE</span> zombies.
                    </p>

                    <p>
                      Only participating family members will know who the
                      zombies are within their family. There will be designated
                      Messenger group chats for all participating members of
                      each family.
                      <span className="font-bold">
                        {" "}
                        Other people may not be added to these chats.
                      </span>
                      Other members of the family may help those playing through
                      the greater family chat,
                      <span className="font-bold">
                        {" "}
                        BUT PLEASE KEEP IT WITHIN REASON.
                      </span>
                    </p>

                    {/* Zombie Rules */}
                    <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                      <h3 className="mb-3 font-mono text-lg font-bold text-rose-700">
                        {"[ZOMBIE RULES]"}
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "Zombies are distinguished by wearing socks on BOTH hands (they may be hidden from view until the kill).",
                          "At the moment of the kill, both socks must be FULLY on the zombie’s hands.",
                          "Kills require a two-hand sock touch: a sock on each hand, firm contact with the human.",
                          "You may tag any extension currently worn by the human (clothes, backpack, etc.), but NOT loose items dangling/held (e.g., shopping bag).",
                          "Zombies may block stuns with an object held with BOTH hands (e.g., laptop, notebook, umbrella). Anything worn on the body can be hit and still counts as a stun.",
                          "Zombies are forbidden from keeping socks that are thrown at them.",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-rose-700">{">"}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Human Rules */}
                    <div className="border-l-4 border-emerald-600 bg-emerald-500/10 p-4">
                      <h3 className="mb-3 font-mono text-lg font-bold text-emerald-700">
                        {"[HUMAN RULES]"}
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "Try your best to stay alive.",
                          "You may temporarily STUN a zombie by throwing a sock that makes direct contact with the zombie.",
                          "A valid stun lasts 15 minutes during which that zombie may not attack the same human.",
                          "No stacking stuns: you cannot apply another stun while a zombie is already stunned. If the zombie attempts again (e.g., after the stun or tries anyway), you may re-stun for the same duration.",
                          "You may stun a known zombie even if they are not actively attacking you.",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-emerald-700">{">"}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Kill Mechanics */}
                    <div className="border-l-4 border-amber-700 bg-amber-500/10 p-4">
                      <h3 className="mb-3 font-mono text-lg font-bold text-amber-800">
                        {"[KILL MECHANICS & REPORTING]"}
                      </h3>
                      <ul className="space-y-2">
                        {[
                          "A kill counts only if (1) the human is aware they were tagged at the moment of contact, and (2) a kill form is submitted.",
                          "Killed humans become active zombies the NEXT DAY (e.g., killed 12:01 AM on the 22nd means they become a zombie at 12:00 AM on the 23rd).",
                          "Stealth is allowed, but awareness at the instant of contact is required.",
                          "The killer must submit online forms to confirm their kill (video preferred). The killer must submit a form to earn points for their family.",
                          "SUBMISSION DEADLINE: Your kill must be submitted BEFORE 11:59 PM on the day of your kill; otherwise it will NOT count.",
                          "DISPUTES: Must be filed WITHIN 1 HOUR of the event. Late disputes will not be tolerated.",
                          "Be reasonable: don’t dispute without cause. COMM has final say on whether kills count.",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-amber-800">{">"}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Safe Zones */}
                    <div className="border-l-4 border-sky-700 bg-sky-500/10 p-4">
                      <h3 className="mb-3 font-mono text-lg font-bold text-sky-800">
                        {"[SAFE ZONES]"}
                      </h3>
                      <p className="mb-2">
                        Humans cannot be killed in the safe zones below. Read
                        carefully to understand how they work.
                        <span className="block font-bold text-rose-700">
                          RESPECT PRIVACY AND DO NOT DISTURB EXTERNAL
                          MEETINGS/ORGS. If we see/hear breaches, you may be
                          removed from HvZ and your family may face
                          consequences.
                        </span>
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Comm Dinner",
                          "“Family Events” (officially designated) — see Family Events rule details",
                          "Your Room // Bathroom // Suite",
                          "Classes // Office Hours",
                          "CSA Culturefest rehearsals (only in the specific rehearsal room)",
                          "Other official CIO activities — be respectful and do NOT disrupt their events",
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-sky-800">{">"}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 italic">
                        More details on safe zones on the “Safe Zones” tab.
                      </p>
                    </div>

                    {/* Quests & Tasks */}
                    <div className="border-l-4 border-emerald-600 bg-emerald-500/10 p-4">
                      <h3 className="mb-3 font-mono text-lg font-bold text-emerald-700">
                        {"[QUESTS & TASKS]"}
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{">"}</span>
                          <span>
                            Tasks will be released throughout the week for
                            points. Each task is only valid on the day it’s
                            released.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{">"}</span>
                          <span className="font-bold">
                            You must send evidence via the Task Form BEFORE
                            11:59 PM on the day of completion.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* Specific Rules */}
              <AccordionItem
                value="specific-rules"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-2xl text-emerald-700">
                    {">> SPECIFIC RULES"}
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-6 font-mono text-sm leading-relaxed">
                    <div className="space-y-3">
                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          NO RESTRAINING PEOPLE.
                        </h3>
                        <p>
                          Zombies collapsing on humans is OKAY -- it’s the same
                          thing as if you are in a corner and then 2 zombies
                          come toward you and you are trapped. What we do not
                          allow is for people to physically restrain people from
                          moving, or have one person block a door. Families can
                          trap people with multiple zombies, but they cannot use
                          humans because there is no reason for those humans to
                          be there blocking the way. Zombies are allowed to trap
                          someone because they are actively trying to kill the
                          human.
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          DO NOT PRETEND TO BE A ZOMBIE.
                        </h3>
                        <p>
                          Only zombies are allowed to wear socks on their hands.
                          Humans are only allowed to carry socks around to stun
                          the zombies.
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          NO ATTACKS ON HUMANS ON TRANSPORTATION.
                        </h3>
                        <p>
                          That's extremely dangerous, and we don't want people
                          to get hurt. To be safe, don’t cram people into these
                          modes of transportation just for the sake of not being
                          attacked by a zombie. Don’t ride your skateboard/bike
                          indoors, it won’t help you and you’ll prob trip and
                          fall
                        </p>
                      </div>

                      <div className="border-l-4 border-emerald-600 bg-emerald-500/10 p-4">
                        <h3 className="mb-2 font-bold text-emerald-700">
                          SUBMIT KILL REPORTS ON TIME.
                        </h3>
                        <p>
                          Only the names that have been submitted before
                          midnight of that day will be counted as kills, so
                          please submit your kills!{" "}
                        </p>
                      </div>

                      <div className="border-l-4 border-emerald-600 bg-emerald-500/10 p-4">
                        <h3 className="mb-2 font-bold text-emerald-700">
                          DEAD HUMANS BECOME ZOMBIES THE NEXT DAY.
                        </h3>
                        <p>
                          Please don't start killing until the next day! Also,
                          be sure to check the document to be sure your death
                          has been recorded.
                        </p>
                        <p className="text-xs text-neutral-600">
                          Ex: If you're zombified at 11:00 PM Tue means you can
                          start infecting 12:00 AM Wed.
                        </p>
                      </div>

                      <div className="border-l-4 border-amber-700 bg-amber-500/10 p-4">
                        <h3 className="mb-2 font-bold text-amber-800">
                          SNEAK KILLS ALLOWED.
                        </h3>
                        <p>
                          We hope this doesn't make the surviving humans extra
                          paranoid! hehehe.
                        </p>
                      </div>

                      <div className="border-l-4 border-amber-700 bg-amber-500/10 p-4">
                        <h3 className="mb-2 font-bold text-amber-800">
                          STUNS ARE PER-HUMAN.
                        </h3>
                        <p>
                          If one human stuns a zombie, then others are not
                          necessarily safe unless they also stun the zombie. For
                          instance, if Maggie was the zombie and Dylan threw a
                          sock at Maggie, then Audrey is not safe from Maggie.
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          DON'T BE AN IDIOT.
                        </h3>
                        <p>
                          Remember what the safe zones are! If you see someone
                          speaking with a professor/TA please don't kill them!
                          Do not jump on cars, damage property, use pepper
                          spray, or punch other people in the face. Do not tag
                          people who are doing something dangerous (like
                          operating heavy machinery).
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          NO PHYSICAL CONTACT (EXCEPT TAGS).
                        </h3>
                        <p>
                          Participants may not hold down humans to prevent them
                          from stunning the zombies. Participants may not hold
                          down zombies to save another human.
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          NO DAMAGE/THEFT.
                        </h3>
                        <p>please...</p>
                      </div>

                      <div className="border-l-4 border-amber-700 bg-amber-500/10 p-4">
                        <h3 className="mb-2 font-bold text-amber-800">
                          PHONE TIME IS OFFICIAL.
                        </h3>
                        <p>
                          If a clock in the room reports something different,
                          follow your phone!
                        </p>
                      </div>

                      <div className="border-l-4 border-amber-700 bg-amber-500/10 p-4">
                        <h3 className="mb-2 font-bold text-amber-800">
                          ZOMBIES MUST WEAR SOCK GLOVES TO TAG.
                        </h3>
                        <p>
                          Zombies must tag a human with SOCKS ON THEIR HANDS and
                          cannot be thrown by a zombie to kill a human.
                        </p>
                      </div>

                      <div className="border-l-4 border-rose-600 bg-rose-500/10 p-4">
                        <h3 className="mb-2 font-bold text-rose-700">
                          SAFETY FIRST.
                        </h3>
                        <p>
                          Nothing is more important than your safety and the
                          safety of others.
                        </p>
                      </div>

                      <div className="border-l-4 border-emerald-600 bg-emerald-500/10 p-4">
                        <h3 className="mb-2 font-bold text-emerald-700">
                          FAMILIES MAY BODY-BLOCK, NOT STUN.
                        </h3>
                        <p>
                          However, zombies and non-players are not able to stun
                          attacking enemy zombies. They simply act as human
                          shields! PEOPLE WHO ARE NOT PLAYING IN HVZ CANNOT
                          PHYSICALLY INTERFERE (i.e. stand between a zombie and
                          human) IN ANY WAY. IF WE DECIDE THAT THIS HAPPENS WE
                          MAY AUTOMATICALLY COUNT/DISCREDIT KILLS.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Safe Zones Section */}
      <section className="border-b-8 border-neutral-900 bg-emerald-900/10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-emerald-700" />
              <h2 className="text-center font-mono text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-900">
                {">> SAFE ZONES"}
              </h2>
              <Shield className="h-8 w-8 text-emerald-700" />
            </div>

            <Accordion type="multiple" className="space-y-4">
              {/* RESIDENCES */}
              <AccordionItem
                value="residences"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-xl text-emerald-700">
                    RESIDENCES
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-3 pt-6 font-mono text-sm leading-relaxed">
                    <p>
                      Humans cannot be killed inside their own room/apartment
                      unless they invite the zombie in themselves.
                      <span className="font-bold text-rose-700">
                        {" "}
                        KILLS FROM FORCEFUL ENTRIES WILL NOT COUNT
                      </span>
                      {
                        " (e.g., forcing into someone’s room or coercing a crewmate to open their door via threats/excessive annoyance)."
                      }
                    </p>
                    <p>
                      Roommates may not invite zombies in to kill their
                      roommates.
                    </p>

                    <ul className="space-y-2 pl-4">
                      <li className="flex gap-2">
                        <span className="text-emerald-700">{"•"}</span>
                        <span>
                          <strong>Hall-style dorms:</strong> Only your room is
                          safe; dorm halls and common areas (lounges, study
                          rooms, etc.) are fair game.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-700">{"•"}</span>
                        <span>
                          <strong>Apartments/houses/suite-style:</strong> You
                          are safe if <strong>both feet</strong> are inside your
                          unit.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-700">{"•"}</span>
                        <span>
                          <strong>Bathrooms:</strong> Safe (please don’t camp
                          inside them so we don’t need a time-limit rule).
                        </span>
                      </li>
                    </ul>

                    <p className="pt-2">
                      <strong>Entering a household:</strong> You must have
                      permission from a resident who is present. If the granting
                      resident is <em>not</em> present, they must{" "}
                      <strong>notify all household members</strong>, and{" "}
                      <strong>all</strong> members must acknowledge and accept
                      that someone will visit at least <strong>10 minutes</strong>{" "}
                      before arrival.
                    </p>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* CLASSES */}
              <AccordionItem
                value="classes"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-xl text-emerald-700">
                    CLASSES
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-3 pt-6 font-mono text-sm leading-relaxed">
                    <p className="font-bold text-rose-700">
                      There will be NO BRAIN-EATING DURING CLASS.
                    </p>
                    <p>
                      A classroom is safe <strong>10 minutes before</strong>{" "}
                      class starts, <strong>during</strong> class, and
                      <strong> 10 minutes after</strong> it ends. Safety applies
                      only <strong>inside the classroom</strong>.
                    </p>
                    <p>
                      Use your cellphones for the official time.
                    </p>
                    <p>
                      Do not attack someone speaking with a professor or TA.
                    </p>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* WORK & GYM */}
              <AccordionItem
                value="work-gym"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-xl text-emerald-700">
                    WORK & GYM
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-3 pt-6 font-mono text-sm leading-relaxed">
                    <p>
                      Humans cannot be tagged while at work (jobs, volunteering,
                      TAing). <em>Concessions count as work.</em>
                    </p>

                    <div className="space-y-2">
                      <p className="font-bold text-emerald-700">GYM RULES:</p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            Safe once <strong>swiped in</strong> to main gym
                            areas; leaving the swiped area removes safety.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            <strong>Must be actively working out.</strong>{" "}
                            Hiding in the AFC is prohibited and may result in
                            disqualification.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            Sports/dance practices and required org meetings are
                            safe in the designated meeting place 10 minutes before and after.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            For{" "}
                            <strong>
                              ALL dance practices at AFC/SLAUGHTER/MEM
                            </strong>
                            , safety applies{" "}
                            <strong>only in your scheduled room</strong> during the scheduled time and during
                            the 10 minute window before and after. You are <strong>NOT</strong>{" "}
                            safe immediately after swipe-in elsewhere (e.g. in the hallway or entrance).
                          </span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* CSA EVENTS */}
              <AccordionItem
                value="csa-events"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-xl text-emerald-700">
                    CSA EVENTS
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-3 pt-6 font-mono text-sm leading-relaxed">
                    <p>
                      CSA events are safe (e.g., officer meetings, CSA sporting
                      events, official family events).
                    </p>
                    <p>
                      Only the <strong>event area</strong> is safe during the scheduled time and during the 10 minute windows before and after.
                    </p>

                    <div className="space-y-2">
                      <p className="font-bold text-emerald-700">
                        FAMILY EVENT RULES:
                      </p>
                      <ul className="space-y-2 pl-4">
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            <strong>Only</strong> family members are safe at
                            that family’s event.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            Definition: 1 guardian (family head/aunt/uncle) + at least 1
                            family member, total <strong>at least 5</strong> people.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            “Walking events” are SAFE at at least 5 people; if it drops
                            to 4, it’s no longer a family event, so it'snot safe.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            Comm chairs do <strong>not</strong> count toward the
                            family-event headcount.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            <strong>Stay together & planned:</strong> meet
                            intentionally, continuously interact, don’t
                            disperse.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            <strong>Proximity rule:</strong> everyone must be
                            able to see each other and remain within ~6 ft.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-emerald-700">{"•"}</span>
                          <span>
                            Meals: you don’t need to queue together, but you{" "}
                            <strong>must sit together</strong>.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <p>Official CSA chalking/talking/flyering is SAFE.</p>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>

              {/* OTHER ZONES */}
              <AccordionItem
                value="other-zones"
                className="rounded-none border-4 border-neutral-900 bg-white/70 shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
              >
                <AccordionTrigger className="border-b-4 border-neutral-900 bg-emerald-500/20 px-6 py-3 hover:no-underline">
                  <CardTitle className="font-mono text-xl text-emerald-700">
                    OTHER SAFE ZONES
                  </CardTitle>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-3 pt-6 font-mono text-sm leading-relaxed">
                    <p>
                      Do not tag humans who are{" "}
                      <strong>driving, biking, on a bus, skateboarding</strong>,
                      etc.
                    </p>
                    <p>
                      <strong>External CIO events</strong> follow class rules:
                      the <strong>event location</strong> is safe for the
                      official duration and {" "}
                      <strong>10 minute</strong> windows before and after. Traveling to/from the event
                      is <strong>not</strong> safe.
                    </p>
                    <p className="text-xs text-neutral-600">
                      Example: Non-CSA dance practice in AFC MP3 8–10 PM → safe
                      in MP3 7:50–10:10 PM only; elsewhere in the AFC is unsafe.
                    </p>

                    <p className="pt-2 text-sm">
                      To request adjustments to safe-zone bounds, email all Comm
                      Chairs (Lawrence McAllister, Chloe Wang, Andrew Wang).
                    </p>

                    <p className="mt-2 font-bold text-rose-700">
                      RESPECT PRIVACY AND DO NOT DISTURB EXTERNAL MEETINGS/ORGS.
                      Breaches may result in removal from HvZ and family
                      consequences.
                    </p>
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-8 border-neutral-900 bg-emerald-900/10">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center font-mono text-xs md:text-sm text-neutral-800">
            <p className="mx-auto inline-block rounded-none border-4 border-neutral-900 bg-white/70 px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.45)]">
              {">> HUMANS VS. ZOMBIES 2025 <<"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

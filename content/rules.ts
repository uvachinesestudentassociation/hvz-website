export type RuleSubsection = {
  id: string
  heading: string
  tone: "rose" | "emerald" | "amber" | "sky"
  items?: string[]
  paragraphs?: string[]
}

export type SpecificRule = {
  id: string
  heading: string
  tone: "rose" | "emerald" | "amber"
  body: string
  footnote?: string
}

export const BASIC_RULES_INTRO = [
  "Each family will start with THREE zombies.",
  "Only participating family members will know who the zombies are within their family. There will be designated Messenger group chats for all participating members of each family. Other people may not be added to these chats. Other members of the family may help those playing through the greater family chat, BUT PLEASE KEEP IT WITHIN REASON.",
]

export const BASIC_RULES_SUBSECTIONS: RuleSubsection[] = [
  {
    id: "zombie-rules",
    heading: "[ZOMBIE RULES]",
    tone: "rose",
    items: [
      "Zombies are distinguished by wearing white socks on BOTH hands (they may be hidden from view until the kill).",
      "At the moment of the kill, both white socks must be FULLY on the zombie's hands.",
      "Kills require a two-hand sock touch: a sock on each hand, firm contact with the human.",
      "You may tag any extension currently worn by the human (clothes, backpack, etc.), but NOT loose items dangling/held (e.g., shopping bag).",
      "Zombies may block stuns with an object held with BOTH hands (e.g., laptop, notebook, umbrella). Anything worn on the body can be hit and still counts as a stun.",
      "Zombies are forbidden from keeping socks that are thrown at them.",
    ],
  },
  {
    id: "human-rules",
    heading: "[HUMAN RULES]",
    tone: "emerald",
    items: [
      "Try your best to stay alive.",
      "You may temporarily STUN a zombie by throwing a sock that makes direct contact with the zombie.",
      "A valid stun lasts 15 minutes during which that zombie may not attack the same human.",
      "No stacking stuns: you cannot apply another stun while a zombie is already stunned. If the zombie attempts again (e.g., after the stun or tries anyway), you may re-stun for the same duration.",
      "You may stun a known zombie even if they are not actively attacking you.",
    ],
  },
  {
    id: "kill-mechanics",
    heading: "[KILL MECHANICS & REPORTING]",
    tone: "amber",
    items: [
      "A kill counts only if (1) the human is aware they were tagged at the moment of contact, and (2) a kill form is submitted.",
      "Killed humans become active zombies the NEXT DAY (e.g., killed 12:01 AM on the 22nd means they become a zombie at 12:00 AM on the 23rd).",
      "Stealth is allowed, but awareness at the instant of contact is required.",
      "The killer must submit proof (video of kill or picture with victim after kill) to the kill form to confirm their kill (video preferred). A form must be submitted to earn points.",
      "SUBMISSION DEADLINE: Your kill must be submitted BEFORE 11:59 PM on the day of your kill; otherwise it will NOT count.",
      "DISPUTES: Must be filed WITHIN 1 HOUR of the event. Late disputes will not be tolerated. To file a dispute, create a Messenger group chat with all parties and all three Comm Chairs.",
      "Be reasonable: don't dispute without cause. COMM has final say on whether kills count.",
    ],
  },
  {
    id: "safe-zones-summary",
    heading: "[SAFE ZONES]",
    tone: "sky",
    paragraphs: [
      "Humans cannot be killed in the safe zones below. Read carefully to understand how they work. RESPECT PRIVACY AND DO NOT DISTURB EXTERNAL MEETINGS/ORGS. If we see/hear breaches, you may be removed from HvZ and your family may face consequences.",
    ],
    items: [
      '"Family Events" (officially designated). See the Family Events rule details.',
      "Your Room // Bathroom // Suite",
      "Classes // Office Hours",
      "CSA Fullmoonfest rehearsals (only in the specific rehearsal room)",
      "Other official CIO activities. Be respectful and do NOT disrupt their events.",
    ],
  },
  {
    id: "quests",
    heading: "[QUESTS]",
    tone: "emerald",
    items: [
      "Quests will be released throughout the week for points. Each quest is only valid on the day it's released.",
      "You must send evidence via the Quest Form BEFORE 11:59 PM on the day of completion.",
      "Shotgun challenge submissions need a clip of you cleaning any indoor mess right after the run or the entry gets tossed.",
      "Quest points are given to the first family to complete the quest unless stated otherwise.",
      "You are not safe while completing quests unless stated otherwise.",
    ],
  },
]

export const SPECIFIC_RULES: SpecificRule[] = [
  {
    id: "no-restraining",
    heading: "NO RESTRAINING PEOPLE.",
    tone: "rose",
    body: "Zombies collapsing on humans is OKAY -- it's the same thing as if you are in a corner and then 2 zombies come toward you and you are trapped. What we do not allow is for people to physically restrain people from moving, or have one person block a door. Families can trap people with multiple zombies, but they cannot use humans because there is no reason for those humans to be there blocking the way. Zombies are allowed to trap someone because they are actively trying to kill the human.",
  },
  {
    id: "no-pretend-zombie",
    heading: "DO NOT PRETEND TO BE A ZOMBIE.",
    tone: "rose",
    body: "Only zombies are allowed to wear socks on their hands. Humans are only allowed to carry socks around to stun the zombies.",
  },
  {
    id: "no-transportation",
    heading: "NO ATTACKS ON HUMANS ON TRANSPORTATION.",
    tone: "rose",
    body: "That's extremely dangerous, and we don't want people to get hurt. To be safe, don't cram people into these modes of transportation just for the sake of not being attacked by a zombie. Don't ride your skateboard/bike indoors, it won't help you and you'll prob trip and fall",
  },
  {
    id: "submit-kills",
    heading: "SUBMIT KILL REPORTS ON TIME.",
    tone: "emerald",
    body: "Only the names that have been submitted before midnight of that day will be counted as kills, so please submit your kills!",
  },
  {
    id: "next-day-zombie",
    heading: "DEAD HUMANS BECOME ZOMBIES THE NEXT DAY.",
    tone: "emerald",
    body: "Please don't start killing until the next day! Also, be sure to check the document to be sure your death has been recorded.",
    footnote: "Ex: If you're zombified at 11:00 PM Tue means you can start infecting 12:00 AM Wed.",
  },
  {
    id: "sneak-kills",
    heading: "SNEAK KILLS ALLOWED.",
    tone: "amber",
    body: "We hope this doesn't make the surviving humans extra paranoid! hehehe.",
  },
  {
    id: "stuns-per-human",
    heading: "STUNS ARE PER-HUMAN.",
    tone: "amber",
    body: "If one human stuns a zombie, then others are not necessarily safe unless they also stun the zombie. For instance, if Maggie was the zombie and Dylan threw a sock at Maggie, then Audrey is not safe from Maggie.",
  },
  {
    id: "dont-be-idiot",
    heading: "DON'T BE AN IDIOT.",
    tone: "rose",
    body: "Remember what the safe zones are! If you see someone speaking with a professor/TA please don't kill them! Do not jump on cars, damage property, use pepper spray, or punch other people in the face. Do not tag people who are doing something dangerous (like operating heavy machinery).",
  },
  {
    id: "no-physical-contact",
    heading: "NO PHYSICAL CONTACT (EXCEPT TAGS).",
    tone: "rose",
    body: "Participants may not hold down humans to prevent them from stunning the zombies. Participants may not hold down zombies to save another human.",
  },
  {
    id: "no-damage",
    heading: "NO DAMAGE/THEFT.",
    tone: "rose",
    body: "please...",
  },
  {
    id: "phone-time",
    heading: "PHONE TIME IS OFFICIAL.",
    tone: "amber",
    body: "If a clock in the room reports something different, follow your phone!",
  },
  {
    id: "sock-gloves",
    heading: "ZOMBIES MUST WEAR WHITE SOCK GLOVES TO TAG.",
    tone: "amber",
    body: "Zombies must tag a human with white socks on their hands and cannot toss the socks to score a kill.",
  },
  {
    id: "safety-first",
    heading: "SAFETY FIRST.",
    tone: "rose",
    body: "Nothing is more important than your safety and the safety of others.",
  },
  {
    id: "body-block",
    heading: "FAMILIES MAY BODY-BLOCK, NOT STUN.",
    tone: "emerald",
    body: "However, zombies and non-players are not able to stun attacking enemy zombies. They simply act as human shields! PEOPLE WHO ARE NOT PLAYING IN HVZ CANNOT PHYSICALLY INTERFERE (i.e. stand between a zombie and human) IN ANY WAY. IF WE DECIDE THAT THIS HAPPENS WE MAY AUTOMATICALLY COUNT/DISCREDIT KILLS.",
  },
]

export const RULES_TOC = [
  { id: "heads-up", label: "Heads up!" },
  { id: "things-to-note", label: "Things to Note" },
  { id: "basic-rules", label: "Basic Rules" },
  { id: "specific-rules", label: "Specific Rules" },
]

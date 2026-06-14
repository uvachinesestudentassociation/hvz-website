import { SITE_CONFIG } from "@/lib/site-config"

export type SafeZoneSection = {
  id: string
  title: string
  paragraphs: string[]
  listItems?: string[]
  footnote?: string
}

export const SAFE_ZONE_SECTIONS: SafeZoneSection[] = [
  {
    id: "residences",
    title: "RESIDENCES",
    paragraphs: [
      "Humans cannot be killed inside their own room/apartment unless they invite the zombie in themselves. KILLS FROM FORCEFUL ENTRIES WILL NOT COUNT (e.g., forcing into someone's room or coercing a crewmate to open their door via threats/excessive annoyance).",
      "Roommates may not invite zombies in to kill their roommates.",
      "Entering a household: You must have permission from a resident who is present. If the granting resident is not present, they must notify all household members, and all members must acknowledge and accept that someone will visit at least 10 minutes before arrival.",
    ],
    listItems: [
      "Hall-style dorms: Only your room is safe; dorm halls and common areas (lounges, study rooms, etc.) are fair game.",
      "Apartments/houses/suite-style: You are safe if both feet are inside your unit.",
      "Bathrooms: Safe (please don't camp inside them so we don't need a time-limit rule).",
    ],
  },
  {
    id: "classes",
    title: "CLASSES",
    paragraphs: [
      "There will be NO BRAIN-EATING DURING CLASS.",
      "A classroom is safe 10 minutes before class starts, during class, and 10 minutes after it ends. Safety applies only inside the classroom.",
      "Use your cellphones for the official time.",
      "Do not attack someone speaking with a professor or TA.",
    ],
  },
  {
    id: "work-gym",
    title: "WORK & GYM",
    paragraphs: [
      "Humans cannot be tagged while at work (e.g. jobs, volunteering, TAing, research). Concessions count as work.",
    ],
    listItems: [
      "When you're working out, your safety kicks in with the first set and ends with the last one. Catch your breath, sure, but duck out for a 30-minute \"rest\" walk and the shield drops.",
      "Step into the AFC hallways or lobby and you're right back in play. Those spots are always live zones.",
      "Sports/dance practices and required org meetings are safe in the designated meeting place 10 minutes before and after.",
      "For ALL dance practices at AFC/SLAUGHTER/MEM, safety applies only in your scheduled room during the scheduled time and during the 10 minute window before and after. You are NOT safe immediately after swipe-in elsewhere (e.g. in the hallway or entrance).",
      "Dance practice announcements are hands off, even if they're happening outside the room.",
    ],
  },
  {
    id: "csa-events",
    title: "CSA EVENTS",
    paragraphs: [
      "CSA events are safe (e.g., officer meetings, CSA sporting events, official family events).",
      "Only the event area is safe during the scheduled time and during the 10 minute windows before and after.",
    ],
  },
  {
    id: "family-events",
    title: "FAMILY EVENT RULES",
    paragraphs: [
      "Definition: 1 guardian (family head/aunt/uncle) + at least 1 general family member; minimum of 5 family members.",
    ],
    listItems: [
      '"Walking events" are SAFE with at least 5 people; if it drops to 4, it\'s no longer a family event, so it\'s not safe.',
      "Comm chairs do not count toward the family-event headcount.",
      "Stay together & planned: meet intentionally, continuously interact, don't disperse.",
      "Proximity rule: everyone must be able to see each other and remain within ~6 ft.",
    ],
  },
  {
    id: "other",
    title: "OTHER SAFE ZONES",
    paragraphs: [
      "Do not tag humans who are driving, biking, on a bus, skateboarding, etc.",
      "External CIO events follow class rules: the event location is safe for the official duration and 10 minute windows before and after. Traveling to/from the event is not safe.",
      `To request adjustments to safe-zone bounds, email all Comm Chairs (${SITE_CONFIG.commChairs.join(", ")}).`,
      "RESPECT PRIVACY AND DO NOT DISTURB EXTERNAL MEETINGS/ORGS. Breaches may result in removal from HvZ and family consequences.",
    ],
    footnote:
      "Example: Non-CSA dance practice in AFC MP3 8–10 PM → safe in MP3 7:50–10:10 PM only; elsewhere in the AFC is unsafe.",
  },
]

export const SAFE_ZONES_TOC = SAFE_ZONE_SECTIONS.map((s) => ({
  id: s.id,
  label: s.title,
}))

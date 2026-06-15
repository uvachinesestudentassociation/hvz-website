import { LINKS } from "@/content/links"

export const SITE_CONFIG = {
  title: "CSA@UVA HvZ",
  description: "Official Humans vs. Zombies rules and resources for CSA@UVA.",
  gameYear: 2026,
  tagline: "Survive the night. Complete quests. Bring honor to your family.",
  signupFormUrl: LINKS.signupForm,
  contactEmail: "community.csa@gmail.com",
  commChairs: ["Aidan Chen", "Autumn Lee", "Evan Liang"],
  themeColor: "#059669",
  url: "https://hvz.csaatuva.com",
} as const;

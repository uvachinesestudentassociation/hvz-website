import { LINKS } from "@/content/links"
import { THEME_COLOR, THEME_COLOR_LIGHT, THEME_COPY } from "@/content/theme"

export const SITE_CONFIG = {
  title: "CSA@UVA HvZ",
  description: "Official Humans vs. Zombies rules and resources for CSA@UVA.",
  gameYear: 2026,
  tagline: THEME_COPY.tagline,
  signupFormUrl: LINKS.signupForm,
  contactEmail: "community.csa@gmail.com",
  commChairs: ["Aidan Chen", "Autumn Lee", "Evan Liang"],
  themeColor: THEME_COLOR,
  themeColorLight: THEME_COLOR_LIGHT,
  url: "https://hvz.csaatuva.com",
} as const;

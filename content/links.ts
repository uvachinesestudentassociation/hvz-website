/**
 * CSA@UVA HvZ — external links
 *
 * Update these URLs each game week. Save this file and redeploy (or refresh
 * in dev) — no other code changes needed.
 */

export const LINKS = {
  /** Home page hero — “Join the Game” button */
  signupForm: "https://forms.gle/bnBijqm8rEba5UfR8",

  /** Report forms — home quick links and mobile nav */
  killReport:
    "https://docs.google.com/forms/d/e/1FAIpQLSdp-wrNfNYv6chC_oLoOJtQrZOT6bsB17DDYaFGRu_3ucHBSQ/viewform?usp=sharing&ouid=106379229173789328231",
  questReport:
    "https://docs.google.com/forms/d/e/1FAIpQLSeXiUsNOmbAOXE0tBpZ-XK0vddYTCwYUwspL5z-ALtXPeia5g/viewform?usp=dialog",

  /** Spreadsheets, docs, and quest board — resources page */
  pointsList:
    "https://docs.google.com/spreadsheets/d/1RYTWc7Elv5VkHXIoPV03W4PcqrtLPoHR0RLLSTc1BzE/edit?usp=sharing",
  populationList:
    "https://docs.google.com/spreadsheets/d/1mjVAyJOkQJHWgUUR5L0jiJPyZ0VWZ_gKy-bkdVUJXrY/edit?usp=sharing",
  graveyard:
    "https://docs.google.com/document/d/1CLhtPH0Eu-ZB0QR3JyvgTJB_6UAp-NUJpagDMEl_pl4/edit?usp=sharing",
  /** Paste the public Slides link from comm. Blank shows a home-screen placeholder. */
  questBoard: "",
} as const

export type LinkId = keyof typeof LINKS

/** Live slideshow embed. Null when the href is not a Google Slides file. */
export function questBoardEmbedUrl(href: string): string | null {
  const match = href.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&rm=minimal`
}

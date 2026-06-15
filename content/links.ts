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
  questBoard:
    "https://docs.google.com/presentation/d/1pbWLdzhPZRhma-ERJi1vzLO1NChjZCdI0bOvgPcdn0w/edit?usp=sharing",
} as const

export type LinkId = keyof typeof LINKS

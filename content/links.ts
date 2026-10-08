/**
 * CSA@UVA HvZ — external links
 *
 * Paste the new URLs from comm. A blank string hides that link until then.
 */

export const LINKS = {
  /** Home page hero — “Join the Game” button */
  signupForm: "",

  /** Report forms — home quick links and mobile nav */
  killReport: "",
  questReport: "",

  /** Spreadsheets, docs, and quest board — resources page */
  pointsList: "",
  populationList: "",
  graveyard: "",
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

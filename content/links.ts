/**
 * CSA@UVA HvZ — external links
 *
 * Paste the new URLs from comm. A blank string hides that link until then.
 */

export const LINKS = {
  /** Home page hero — “Join the Game” button */
  signupForm: "https://docs.google.com/forms/d/1FvfRs1mH2syAWyQ83ziV6S8G5bUwda36a7cpM1Jz2uA/edit",

  /** Report forms — home quick links and mobile nav */
  killReport: "https://docs.google.com/forms/d/1qnny7aQCcWpTkLoGpp1-ybY3csxIcPV-WR4p8tZptxA/edit",
  questReport: "https://docs.google.com/forms/d/1yljepLho9YlzWBLqOLC1ouCwQHarih4jgUnCiB9GW64/edit",

  /** Spreadsheets, docs, and quest board — resources page */
  pointsList: "https://docs.google.com/spreadsheets/d/1ifMcPXFWOvvZdibqVijEExVSRE686RXXSMPIZbZ7UvU/edit?gid=0#gid=0",
  populationList: "https://docs.google.com/spreadsheets/d/15jdUdtsR4H_ZXtsfXhUieAKHpmboXnE7LFsvqKLYszc/edit?gid=0#gid=0",
  graveyard: "https://docs.google.com/document/d/1EpDjQ4wqjj-Tnp8-RS5v_Oy_kbb82AgHJh7Q5A3m5wE/edit?tab=t.0#heading=h.ei36dk6uim4i",
  /** Paste the public Slides link from comm. Blank shows a home-screen placeholder. */
  questBoard: "https://docs.google.com/presentation/d/1bRRm5yc19JAhB1RxIWGoetmOwnsPDgYW8O5p2N85sDQ/edit?slide=id.p#slide=id.p",
} as const

export type LinkId = keyof typeof LINKS

/** Live slideshow embed. Null when the href is not a Google Slides file. */
export function questBoardEmbedUrl(href: string): string | null {
  const match = href.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&rm=minimal`
}

/** Iframe src for a form or sheet. Other URLs are unchanged. */
export function resourceEmbedUrl(href: string): string {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return href
  }
  if (url.hostname !== "docs.google.com") return href
  if (url.pathname.includes("/forms/") && url.pathname.includes("/viewform")) {
    url.searchParams.set("embedded", "true")
    return url.toString()
  }
  const sheet = url.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (sheet) return `https://docs.google.com/spreadsheets/d/${sheet[1]}/htmlembed`
  return href
}

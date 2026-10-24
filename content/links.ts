/**
 * CSA@UVA HvZ — external links
 *
 * Paste the new URLs from comm. A blank string hides that link until then.
 */

export const LINKS = {
  /** Home page hero — “Join the Game” button */
  signupForm: "https://docs.google.com/forms/d/1FvfRs1mH2syAWyQ83ziV6S8G5bUwda36a7cpM1Jz2uA/edit",

  /** Published respondent links. Do not append a name or email. */
  killReport: "https://docs.google.com/forms/d/e/1FAIpQLSfqpi58EQOTCn2Sxa_lZ4n_8Gtz2nLbubSKH3TOemRJg9CVSA/viewform",
  questReport: "https://docs.google.com/forms/d/e/1FAIpQLSdJY_5InoD_j79mjRJv1eQ3zEgs6r94rduobPr4SBz2_YV0qQ/viewform",

  /** Spreadsheets, docs, and quest board — resources page */
  pointsList: "https://docs.google.com/spreadsheets/d/1ifMcPXFWOvvZdibqVijEExVSRE686RXXSMPIZbZ7UvU/edit?gid=0#gid=0",
  populationList: "https://docs.google.com/spreadsheets/d/15jdUdtsR4H_ZXtsfXhUieAKHpmboXnE7LFsvqKLYszc/edit?gid=0#gid=0",
  graveyard: "https://docs.google.com/document/d/1EpDjQ4wqjj-Tnp8-RS5v_Oy_kbb82AgHJh7Q5A3m5wE/edit?tab=t.0#heading=h.ei36dk6uim4i",
  /** Paste the public Slides link from comm. Blank shows a home-screen placeholder. */
  questBoard: "https://docs.google.com/presentation/d/1bRRm5yc19JAhB1RxIWGoetmOwnsPDgYW8O5p2N85sDQ/edit?slide=id.p#slide=id.p",

  /** Public respondent link. Do not append a name or email. */
  feedback: "https://docs.google.com/forms/d/e/1FAIpQLSfU8obDBxRvoIwG818pCDOJmzS5rlLqk9tWVXxfL04EVIvL7A/viewform",
} as const

export type LinkId = keyof typeof LINKS

/** Live deck. Null when the href is not a Google Slides file. */
export function questBoardEmbedUrl(href: string): string | null {
  const match = href?.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/)
  if (!match) return null
  return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&rm=minimal`
}

/**
 * Iframe src for a published form or a sheet.
 * Editor form links cannot be embedded. Returns null for those.
 */
export function resourceEmbedUrl(href: string): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  if (url.hostname !== "docs.google.com") return href
  if (url.pathname.includes("/forms/")) {
    if (!url.pathname.includes("/viewform")) return null
    url.searchParams.set("embedded", "true")
    return url.toString()
  }
  const sheet = url.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/)
  if (sheet) return `https://docs.google.com/spreadsheets/d/${sheet[1]}/htmlembed`
  return href
}

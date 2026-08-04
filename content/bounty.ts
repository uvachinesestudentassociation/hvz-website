/**
 * Active bounty poster on home + resources.
 *
 * To post a bounty:
 * 1. Drop a photo in `public/bounty/` (e.g. `public/bounty/target.jpg`)
 * 2. Fill in the fields below (`imageSrc` should be `/bounty/target.jpg`)
 * 3. Set `BOUNTY_REVEALED` to `true` when you're ready for players to see it
 *
 * Set `ACTIVE_BOUNTY` to `null` to remove the poster entirely.
 */
export type BountyTarget = {
  /** Name shown on the poster */
  name: string
  /** Public path under /public, e.g. "/bounty/target.jpg". Empty = "?" placeholder. */
  imageSrc: string
  /** Reward line, e.g. "250 points" or "Bragging rights" */
  reward: string
  /** Optional extra note under the reward */
  note?: string
  /** Optional click-through link (leave unset for a non-link poster) */
  href?: string
}

/** Flip to true when the bounty should be readable by players. */
export const BOUNTY_REVEALED = false

export const ACTIVE_BOUNTY: BountyTarget | null = {
  name: "CLASSIFIED",
  imageSrc: "",
  reward: "See Comm for details",
  note: "Bring proof to claim the bounty.",
}

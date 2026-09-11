import type { BountyTarget } from "@/content/bounty"

export type BountyDisplay =
  | { kind: "vacant" }
  | { kind: "sealed" }
  | {
      kind: "revealed"
      name: string
      imageSrc: string
      reward: string
      note?: string
      href?: string
    }

export function getBountyDisplay(
  target: BountyTarget | null,
  revealed: boolean,
): BountyDisplay {
  if (!target) return { kind: "vacant" }
  if (!revealed) return { kind: "sealed" }
  return {
    kind: "revealed",
    name: target.name,
    imageSrc: target.imageSrc,
    reward: target.reward,
    note: target.note,
    href: target.href,
  }
}

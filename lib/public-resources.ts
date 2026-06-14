import type { LucideIcon } from "lucide-react"
import { FileText, Scroll, Skull, Target, Users } from "lucide-react"

export type PublicResource = {
  label: string
  description?: string
  href: string
  icon: LucideIcon
  priority?: "high" | "normal"
}

export const PUBLIC_RESOURCES: PublicResource[] = [
  {
    label: "Kill Report",
    description: "Submit a kill form",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdp-wrNfNYv6chC_oLoOJtQrZOT6bsB17DDYaFGRu_3ucHBSQ/viewform?usp=sharing&ouid=106379229173789328231",
    icon: FileText,
    priority: "high",
  },
  {
    label: "Quest Report",
    description: "Submit quest evidence",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeXiUsNOmbAOXE0tBpZ-XK0vddYTCwYUwspL5z-ALtXPeia5g/viewform?usp=dialog",
    icon: FileText,
    priority: "high",
  },
  {
    label: "Points List",
    description: "Family standings",
    href: "https://docs.google.com/spreadsheets/d/1RYTWc7Elv5VkHXIoPV03W4PcqrtLPoHR0RLLSTc1BzE/edit?usp=sharing",
    icon: Target,
  },
  {
    label: "Population List",
    description: "Who is still alive",
    href: "https://docs.google.com/spreadsheets/d/1mjVAyJOkQJHWgUUR5L0jiJPyZ0VWZ_gKy-bkdVUJXrY/edit?usp=sharing",
    icon: Users,
  },
  {
    label: "Graveyard",
    description: "Fallen players",
    href: "https://docs.google.com/document/d/1CLhtPH0Eu-ZB0QR3JyvgTJB_6UAp-NUJpagDMEl_pl4/edit?usp=sharing",
    icon: Skull,
  },
  {
    label: "Quest Board",
    description: "Daily quests",
    href: "https://docs.google.com/presentation/d/1pbWLdzhPZRhma-ERJi1vzLO1NChjZCdI0bOvgPcdn0w/edit?usp=sharing",
    icon: Scroll,
  },
]

export function getSortedResources(prioritizeHigh = false): PublicResource[] {
  if (!prioritizeHigh) return PUBLIC_RESOURCES
  return [...PUBLIC_RESOURCES].sort((a, b) => {
    const aHigh = a.priority === "high" ? 0 : 1
    const bHigh = b.priority === "high" ? 0 : 1
    return aHigh - bHigh
  })
}

export function getFormResources() {
  return PUBLIC_RESOURCES.filter((r) => r.priority === "high")
}

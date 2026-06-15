import type { LucideIcon } from "lucide-react"
import { FileText, Scroll, Skull, Target, Users } from "lucide-react"
import { LINKS, type LinkId } from "@/content/links"

export type PublicResource = {
  id: LinkId
  label: string
  description?: string
  href: string
  icon: LucideIcon
  priority?: "high" | "normal"
}

type ResourceDefinition = {
  id: Exclude<LinkId, "signupForm">
  label: string
  description?: string
  icon: LucideIcon
  priority?: "high" | "normal"
}

const RESOURCE_DEFINITIONS: ResourceDefinition[] = [
  {
    id: "killReport",
    label: "Kill Report",
    description: "Submit a kill form",
    icon: FileText,
    priority: "high",
  },
  {
    id: "questReport",
    label: "Quest Report",
    description: "Submit quest evidence",
    icon: FileText,
    priority: "high",
  },
  {
    id: "pointsList",
    label: "Points List",
    description: "Family standings",
    icon: Target,
  },
  {
    id: "populationList",
    label: "Population List",
    description: "Who is still alive",
    icon: Users,
  },
  {
    id: "graveyard",
    label: "Graveyard",
    description: "Fallen players",
    icon: Skull,
  },
  {
    id: "questBoard",
    label: "Quest Board",
    description: "Daily quests",
    icon: Scroll,
  },
]

export const PUBLIC_RESOURCES: PublicResource[] = RESOURCE_DEFINITIONS.map((resource) => ({
  ...resource,
  href: LINKS[resource.id],
}))

export function getResource(id: Exclude<LinkId, "signupForm">): PublicResource {
  const resource = PUBLIC_RESOURCES.find((r) => r.id === id)
  if (!resource) throw new Error(`Unknown resource: ${id}`)
  return resource
}

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

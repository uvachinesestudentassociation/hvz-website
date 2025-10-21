import type { LucideIcon } from "lucide-react"
import { FileText, Folder, Link as LinkIcon, Scroll, Skull, Target, Users } from "lucide-react"

export type PublicResource = {
  label: string
  href: string
  icon: LucideIcon
}

export const PUBLIC_RESOURCES: PublicResource[] = [
  {
    label: "Points List",
    href: "https://docs.google.com/spreadsheets/d/1RYTWc7Elv5VkHXIoPV03W4PcqrtLPoHR0RLLSTc1BzE/edit?usp=sharing",
    icon: Target,
  },
  {
    label: "Population List",
    href: "https://docs.google.com/spreadsheets/d/1mjVAyJOkQJHWgUUR5L0jiJPyZ0VWZ_gKy-bkdVUJXrY/edit?usp=sharing",
    icon: Users,
  },
  {
    label: "Graveyard",
    href: "https://docs.google.com/document/d/1CLhtPH0Eu-ZB0QR3JyvgTJB_6UAp-NUJpagDMEl_pl4/edit?usp=sharing",
    icon: Skull,
  },
  {
    label: "Quest Board",
    href: "https://docs.google.com/presentation/d/1pbWLdzhPZRhma-ERJi1vzLO1NChjZCdI0bOvgPcdn0w/edit?usp=sharing",
    icon: Scroll,
  },
  {
    label: "Kill Report (Form)",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSdp-wrNfNYv6chC_oLoOJtQrZOT6bsB17DDYaFGRu_3ucHBSQ/viewform?usp=sharing&ouid=106379229173789328231",
    icon: FileText,
  },
  {
    label: "Quest Report (Form)",
    href: "https://docs.google.com/forms/d/e/1FAIpQLSeXiUsNOmbAOXE0tBpZ-XK0vddYTCwYUwspL5z-ALtXPeia5g/viewform?usp=dialog",
    icon: FileText,
  },
]

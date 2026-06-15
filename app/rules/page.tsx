import type { Metadata } from "next"
import { RulesContent } from "@/components/rules-content"

export const metadata: Metadata = {
  title: "Game Rules",
  description: "Official Humans vs. Zombies game rules for CSA@UVA.",
}

export default function RulesPage() {
  return <RulesContent />
}

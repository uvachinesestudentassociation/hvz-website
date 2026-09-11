import type { Metadata } from "next"
import { SafeZonesContent } from "@/components/safe-zones-content"

export const metadata: Metadata = {
  title: "Safe Zones",
  description: "Official safe zone rules for CSA@UVA Humans vs. Zombies.",
}

export default function SafeZonesPage() {
  return <SafeZonesContent />
}

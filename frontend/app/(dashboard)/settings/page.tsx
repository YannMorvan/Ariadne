import type { Metadata } from "next"
import SettingsClient from "@/components/settings/views/settings-client"

export const metadata: Metadata = {
  title: "Settings",
}

export default function SettingsPage() {
  return <SettingsClient />
}

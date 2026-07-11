import { prisma } from "@/lib/db/prisma"
import { SettingsEditor } from "./editor"

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany()
  return <SettingsEditor settings={JSON.parse(JSON.stringify(settings))} />
}

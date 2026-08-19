import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { EditTimelineForm } from "./edit-form"

export default async function EditTimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await prisma.timelineEvent.findUnique({ where: { id } })
  if (!event) notFound()
  return <EditTimelineForm event={JSON.parse(JSON.stringify(event))} />
}

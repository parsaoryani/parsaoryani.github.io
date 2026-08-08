import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(request.url)
  const entityType = url.searchParams.get("type")
  const entityId = url.searchParams.get("id")

  if (!entityType || !entityId) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 })
  }

  try {
    let data = null

    switch (entityType) {
      case "publication":
        data = await prisma.publication.findUnique({
          where: { id: entityId },
          include: { tags: { include: { tag: true } } },
        })
        break
      case "project":
        data = await prisma.project.findUnique({
          where: { id: entityId },
          include: { tags: { include: { tag: true } } },
        })
        break
      case "teaching":
        data = await prisma.teachingAssistant.findUnique({ where: { id: entityId } })
        break
      case "researching":
        data = await prisma.researchingAssistant.findUnique({ where: { id: entityId } })
        break
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Return the data including drafts (admin-only preview)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to load preview" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { courseId } = await params
    const body = await request.json()
    const { linkIds } = body // array of link IDs in new order

    if (!Array.isArray(linkIds)) {
      return NextResponse.json({ error: "linkIds array required" }, { status: 400 })
    }

    const updates = linkIds.map((id, index) =>
      prisma.courseLink.update({
        where: { id, courseId },
        data: { sortOrder: index },
      })
    )

    await prisma.$transaction(updates)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to reorder links" }, { status: 500 })
  }
}
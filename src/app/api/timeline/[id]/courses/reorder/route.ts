import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { courseIds } = body // array of course IDs in new order

    if (!Array.isArray(courseIds)) {
      return NextResponse.json({ error: "courseIds array required" }, { status: 400 })
    }

    const updates = courseIds.map((courseId, index) =>
      prisma.course.update({
        where: { id: courseId, timelineEventId: id },
        data: { sortOrder: index },
      })
    )

    await prisma.$transaction(updates)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to reorder courses" }, { status: 500 })
  }
}
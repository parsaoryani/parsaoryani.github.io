import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { courseId } = await params
  const files = await prisma.courseFile.findMany({
    where: { courseId },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(files)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { courseId } = await params
    const body = await request.json()
    const { fileIds } = body // array of file IDs in new order

    if (!Array.isArray(fileIds)) {
      return NextResponse.json({ error: "fileIds array required" }, { status: 400 })
    }

    const updates = fileIds.map((id, index) =>
      prisma.courseFile.update({
        where: { id, courseId },
        data: { sortOrder: index },
      })
    )

    await prisma.$transaction(updates)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to reorder files" }, { status: 500 })
  }
}
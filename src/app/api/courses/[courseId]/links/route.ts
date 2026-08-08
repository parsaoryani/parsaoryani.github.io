import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { courseId } = await params
  const links = await prisma.courseLink.findMany({
    where: { courseId },
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
  })
  return NextResponse.json(links)
}

export async function POST(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId } = await params
    const body = await request.json()

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const maxOrder = await prisma.courseLink.aggregate({
      where: { courseId, type: body.type },
      _max: { sortOrder: true },
    })

    const link = await prisma.courseLink.create({
      data: {
        courseId,
        type: body.type, // "exercise" | "project"
        name: body.name,
        url: body.url,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.link.create",
        ip,
        metadata: { linkId: link.id, type: link.type, name: link.name, courseId },
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}
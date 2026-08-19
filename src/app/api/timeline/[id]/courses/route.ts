import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const event = await prisma.timelineEvent.findUnique({ where: { id } })
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const courses = await prisma.course.findMany({
    where: { timelineEventId: id },
    include: { 
      files: { orderBy: { sortOrder: "asc" } },
      links: { orderBy: [{ type: "asc" }, { sortOrder: "asc" }] }
    },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(courses)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    const body = await request.json()

    const event = await prisma.timelineEvent.findUnique({ where: { id } })
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const maxOrder = await prisma.course.aggregate({
      where: { timelineEventId: id },
      _max: { sortOrder: true },
    })

    const course = await prisma.course.create({
      data: {
        timelineEventId: id,
        name: body.name,
        grade: body.grade || null,
        highlight: body.highlight || null,
        instructor: body.instructor || null,
        focus: body.focus || null,
        topics: body.topics || null,
        syllabus: body.syllabus || null,
        exercises: body.exercises || null,
        projects: body.projects || null,
        discussions: body.discussions || null,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.create",
        ip,
        metadata: { courseId: course.id, name: course.name, timelineEventId: id },
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
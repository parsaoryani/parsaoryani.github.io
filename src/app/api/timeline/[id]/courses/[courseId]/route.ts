import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string; courseId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { files: { orderBy: { sortOrder: "asc" } } },
  })
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(course)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; courseId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId } = await params
    const body = await request.json()

    const existing = await prisma.course.findUnique({ where: { id: courseId } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
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
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.update",
        ip,
        metadata: { courseId, name: course.name },
      },
    })

    return NextResponse.json(course)
  } catch {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; courseId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId } = await params

    await prisma.course.delete({ where: { id: courseId } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.delete",
        ip,
        metadata: { courseId },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}
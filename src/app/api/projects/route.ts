import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { projectSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const body = await request.json()
    const parsed = projectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { tagIds, sortOrder: requestedOrder, ...data } = parsed.data
    const finalOrder = requestedOrder ?? ((await prisma.project.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0) + 1

    const project = await prisma.project.create({
      data: {
        ...data,
        techStack: data.techStack || [],
        sortOrder: finalOrder,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
    })

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "project.create", ip, metadata: { id: project.id, title: project.title } },
    })

    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { teachingSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const items = await prisma.teachingAssistant.findMany({ orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }] })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await request.json()
    const parsed = teachingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    const { highlights, ...data } = parsed.data
    const maxOrder = await prisma.teachingAssistant.aggregate({ _max: { sortOrder: true } })
    const item = await prisma.teachingAssistant.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        ...(data.endDate ? { endDate: new Date(data.endDate) } : {}),
        highlights: highlights || [],
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "teaching.create", ip: (await headers()).get("x-forwarded-for") || "unknown", metadata: { id: item.id, course: item.course } },
    })
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

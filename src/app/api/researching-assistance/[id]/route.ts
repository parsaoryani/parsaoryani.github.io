import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { researchingSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const item = await prisma.researchingAssistant.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = researchingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    const { outcomes, ...data } = parsed.data
    const item = await prisma.researchingAssistant.update({
      where: { id },
      data: {
        ...data,
        startDate: new Date(data.startDate),
        ...(data.endDate ? { endDate: new Date(data.endDate) } : { endDate: null }),
        outcomes: outcomes || [],
      },
    })
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "researching.update", ip: (await headers()).get("x-forwarded-for") || "unknown", metadata: { id: item.id, topic: item.topic } },
    })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params
    await prisma.researchingAssistant.delete({ where: { id } })
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "researching.delete", ip: (await headers()).get("x-forwarded-for") || "unknown", metadata: { id } },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        slug: body.slug,
        label: body.label,
        description: body.description || null,
        color: body.color || null,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "tag.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id, label: body.label },
      },
    })

    return NextResponse.json(tag)
  } catch {
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.tag.delete({ where: { id } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "tag.delete",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 })
  }
}

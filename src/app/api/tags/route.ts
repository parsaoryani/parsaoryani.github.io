import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tags = await prisma.tag.findMany({ orderBy: { label: "asc" } })
  return NextResponse.json(tags)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const tag = await prisma.tag.create({
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
        action: "tag.create",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id: tag.id, label: tag.label },
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}

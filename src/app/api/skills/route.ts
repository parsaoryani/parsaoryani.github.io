import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const categories = await prisma.skillCategory.findMany({
    include: { skills: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const maxOrder = await prisma.skillCategory.aggregate({ _max: { sortOrder: true } })

    const category = await prisma.skillCategory.create({
      data: {
        name: body.name,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
      include: { skills: true },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "skill_category.create",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id: category.id, name: category.name },
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

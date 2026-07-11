import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const maxOrder = await prisma.skill.aggregate({
      _max: { sortOrder: true },
      where: { categoryId: body.categoryId },
    })

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        categoryId: body.categoryId,
        proficiency: body.proficiency || "advanced",
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })
    return NextResponse.json(skill, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}

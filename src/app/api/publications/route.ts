import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { publicationSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const publications = await prisma.publication.findMany({
    where: { deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })

  return NextResponse.json(publications)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = publicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { tagIds, ...data } = parsed.data
    const maxOrder = await prisma.publication.aggregate({ _max: { sortOrder: true } })

    const publication = await prisma.publication.create({
      data: {
        ...data,
        authors: data.authors || [],
        contributions: data.contributions || [],
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId: string) => ({ tagId })) }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "publication.create",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id: publication.id, title: publication.title },
      },
    })

    return NextResponse.json(publication, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 })
  }
}

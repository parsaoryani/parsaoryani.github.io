import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { researchProposalSchema } from "@/lib/validation/research-portfolio"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const proposals = await prisma.researchProposal.findMany({
    where: { deletedAt: null },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { year: "desc" }],
  })
  return NextResponse.json(proposals)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const parsed = researchProposalSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }
    const { version: _version, ...data } = parsed.data
    void _version
    const proposal = await prisma.researchProposal.create({ data })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "research_proposal.create",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { id: proposal.id, title: proposal.title },
      },
    })
    revalidatePath("/research")
    return NextResponse.json(proposal, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create research proposal" }, { status: 500 })
  }
}

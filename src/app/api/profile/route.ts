import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"
import { getProfile, getPageContent, updateProfile, updatePageContent } from "@/lib/content/profile"
import { headers } from "next/headers"
import { prisma } from "@/lib/db/prisma"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [profile, pageContent] = await Promise.all([getProfile(), getPageContent()])
  return NextResponse.json({ profile, pageContent })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { profile, pageContent } = body

    const results: { profile?: unknown; pageContent?: unknown } = {}

    if (profile) {
      results.profile = await updateProfile(profile)
    }

    if (pageContent) {
      results.pageContent = await updatePageContent(pageContent)
    }

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "profile.update",
        ip: (await headers()).get("x-forwarded-for") || "unknown",
        metadata: { fields: Object.keys(body) },
      },
    })

    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
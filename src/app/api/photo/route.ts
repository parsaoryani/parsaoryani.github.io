import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "profile_photo" } })
  return NextResponse.json(setting?.value ?? { url: "", alt: "Profile photo" })
}

export async function PUT(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { url, alt } = await request.json()
    const setting = await prisma.siteSetting.upsert({
      where: { key: "profile_photo" },
      update: { value: { url: url || "", alt: alt || "Profile photo" } },
      create: { key: "profile_photo", value: { url: url || "", alt: alt || "Profile photo" } },
    })
    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "photo.update", ip },
    })
    return NextResponse.json(setting)
  } catch {
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

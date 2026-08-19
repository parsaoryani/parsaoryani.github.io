import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    const body = await request.json()

    const setting = await prisma.siteSetting.update({
      where: { id },
      data: { value: body.value },
    })

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "setting.update", ip, metadata: { id, key: setting.key } },
    })

    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/cv")

    return NextResponse.json(setting)
  } catch {
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const message = await prisma.contactMessage.findUnique({ where: { id } })
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(message)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    const body = await request.json()

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status: body.status },
    })

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: `message.${body.status}`, ip, metadata: { id, subject: message.subject } },
    })

    return NextResponse.json(message)
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { id } = await params
    await prisma.contactMessage.delete({ where: { id } })

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "message.delete", ip, metadata: { id } },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

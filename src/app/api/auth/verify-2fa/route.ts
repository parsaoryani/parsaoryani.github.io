import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createHash } from "crypto"
import { verifyTotp } from "@/lib/auth/auth"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"

    const body = await request.json()
    const { token, sessionToken } = body

    if (!token || !sessionToken || token.length !== 6) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const tokenHash = createHash("sha256").update(sessionToken).digest("hex")
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    if (!session.user.totpSecret) {
      return NextResponse.json({ error: "2FA not configured" }, { status: 400 })
    }

    if (!verifyTotp(token, session.user.totpSecret)) {
      await prisma.auditLog.create({
        data: { userId: session.user.id, action: "login.2fa_fail", ip },
      })
      return NextResponse.json({ error: "Invalid code" }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { failedAttempts: 0, lastLoginAt: new Date(), lastLoginIp: ip },
    })

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: "login.success", ip },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

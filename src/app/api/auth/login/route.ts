import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { verifyPassword, createSession } from "@/lib/auth/auth"
import { loginSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || undefined

    if (!checkRateLimit(`login:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Try later." }, { status: 429 })
    }

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      await prisma.auditLog.create({
        data: { action: "login.fail", ip, metadata: { email } },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json({ error: "Account locked. Try later." }, { status: 423 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: { increment: 1 } },
      })

      if (user.failedAttempts + 1 >= 5) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) },
        })
      }

      await prisma.auditLog.create({
        data: { userId: user.id, action: "login.fail", ip },
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.totpEnabled) {
      const sessionToken = await createSession(user.id, ip, userAgent)
      await prisma.auditLog.create({
        data: { userId: user.id, action: "login.2fa_required", ip },
      })
      return NextResponse.json({ requires2fa: true, sessionToken }, { status: 200 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lastLoginAt: new Date(), lastLoginIp: ip },
    })

    await createSession(user.id, ip, userAgent)

    await prisma.auditLog.create({
      data: { userId: user.id, action: "login.success", ip },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}

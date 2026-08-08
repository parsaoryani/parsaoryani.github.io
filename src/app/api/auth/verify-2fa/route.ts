import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { createHash } from "crypto"
import { verifyTotp, createSession } from "@/lib/auth/auth"
import { headers } from "next/headers"

const MAX_CHALLENGE_ATTEMPTS = 5

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"

    const body = await request.json()
    const { token, challengeToken } = body

    if (!token || !challengeToken || token.length !== 6) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const challengeHash = createHash("sha256").update(challengeToken).digest("hex")
    const challenge = await prisma.pendingTwoFactorChallenge.findUnique({
      where: { challengeHash },
      include: { user: true },
    })

    if (!challenge || challenge.expiresAt < new Date()) {
      if (challenge) {
        await prisma.pendingTwoFactorChallenge.delete({ where: { id: challenge.id } })
      }
      return NextResponse.json({ error: "Challenge expired" }, { status: 401 })
    }

    if (challenge.attempts >= MAX_CHALLENGE_ATTEMPTS) {
      await prisma.pendingTwoFactorChallenge.delete({ where: { id: challenge.id } })
      await prisma.auditLog.create({
        data: { userId: challenge.userId, action: "login.2fa_challenge_exhausted", ip },
      })
      return NextResponse.json({ error: "Too many attempts. Please log in again." }, { status: 429 })
    }

    if (!challenge.user.totpSecret) {
      await prisma.pendingTwoFactorChallenge.delete({ where: { id: challenge.id } })
      return NextResponse.json({ error: "2FA not configured" }, { status: 400 })
    }

    if (!verifyTotp(token, challenge.user.totpSecret)) {
      await prisma.pendingTwoFactorChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      })
      await prisma.auditLog.create({
        data: { userId: challenge.userId, action: "login.2fa_fail", ip },
      })
      return NextResponse.json({ error: "Invalid code" }, { status: 401 })
    }

    // TOTP verified - consume challenge and create real session
    await prisma.pendingTwoFactorChallenge.delete({ where: { id: challenge.id } })

    await prisma.user.update({
      where: { id: challenge.user.id },
      data: { failedAttempts: 0, lastLoginAt: new Date(), lastLoginIp: ip },
    })

    await createSession(challenge.user.id, ip)

    await prisma.auditLog.create({
      data: { userId: challenge.user.id, action: "login.success", ip },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
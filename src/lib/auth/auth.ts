import "server-only"
import { cookies } from "next/headers"
import { prisma } from "@/lib/db/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET environment variable is required")
const JWT_SECRET: string = process.env.JWT_SECRET
const SESSION_COOKIE = "session_token"
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7 // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string, ip?: string, userAgent?: string) {
  const token = crypto.randomBytes(48).toString("hex")
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await prisma.session.create({
    data: { userId, tokenHash, expiresAt, ip, userAgent },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } })
    }
    return null
  }

  return session
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
    await prisma.session.deleteMany({ where: { tokenHash } })
  }
  cookieStore.delete(SESSION_COOKIE)
}

export function generateTotpSecret(): string {
  return crypto.randomBytes(20).toString("hex")
}

export function verifyTotp(token: string, secret: string): boolean {
  // In production, use a proper TOTP library like otplib
  // For now, this is a simplified version
  try {
    const { createHmac } = crypto
    const epoch = Math.floor(Date.now() / 30000)
    const key = Buffer.from(secret, "hex")
    const msg = Buffer.alloc(8)
    msg.writeBigInt64BE(BigInt(epoch))
    const hash = createHmac("sha1", key).update(msg).digest()
    const offset = hash[hash.length - 1]! & 0xf
    const binary =
      ((hash[offset]! & 0x7f) << 24) |
      ((hash[offset + 1]! & 0xff) << 16) |
      ((hash[offset + 2]! & 0xff) << 8) |
      (hash[offset + 3]! & 0xff)
    const otp = binary % 1000000
    return token === String(otp).padStart(6, "0")
  } catch {
    return false
  }
}

export function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 8; i++) {
    codes.push(crypto.randomBytes(4).toString("hex").toUpperCase())
  }
  return codes
}

export function signJwt(payload: Record<string, unknown>, expiresIn = "15m"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}

export const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"

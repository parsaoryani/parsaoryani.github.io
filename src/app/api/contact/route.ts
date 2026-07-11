import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { contactFormSchema } from "@/lib/validation/schemas"
import { headers } from "next/headers"
import { sendContactNotification, sendContactConfirmation } from "@/lib/email"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    if (!checkRateLimit(`contact:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Try later." }, { status: 429 })
    }

    const body = await request.json()
    const parsed = contactFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await prisma.contactMessage.create({
      data: {
        ...parsed.data,
        subject: parsed.data.subject || null,
        ip,
      },
    })

    const emailSent = process.env.RESEND_API_KEY
      ? await Promise.all([
          sendContactNotification(parsed.data),
          sendContactConfirmation(parsed.data),
        ]).then(() => true).catch((err) => { console.error("Email sending failed:", err); return false })
      : false

    return NextResponse.json({ success: true, emailSent }, { status: 200 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

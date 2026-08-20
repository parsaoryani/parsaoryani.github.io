import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { headers } from "next/headers"
import fs from "fs/promises"
import path from "path"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ courseId: string; fileId: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"
    const { courseId, fileId } = await params

    const file = await prisma.courseFile.findFirst({
      where: { id: fileId, courseId },
    })
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Delete from storage
    if (file.url.startsWith("/uploads/")) {
      // turbopackIgnore: file.url is a runtime DB value, so static analysis
      // cannot scope this path and traces the entire project into the bundle.
      const filePath = path.join(/*turbopackIgnore: true*/ process.cwd(), file.url)
      await fs.unlink(filePath).catch(() => {})
    }

    await prisma.courseFile.delete({ where: { id: fileId } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "course.file.delete",
        ip,
        metadata: { fileId, courseId, fileName: file.name },
      },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
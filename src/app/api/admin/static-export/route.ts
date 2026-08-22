import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { runStaticExport } from "@/lib/static-export/exporter"

export const dynamic = "force-dynamic"

export async function POST() {
  const session = await getSession()
  if (!session || session.user.role !== "owner") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (process.env.NODE_ENV !== "development" || process.env.ALLOW_LOCAL_STATIC_EXPORT !== "1") {
    return NextResponse.json(
      { error: "Static export is available only in development with ALLOW_LOCAL_STATIC_EXPORT=1." },
      { status: 404 }
    )
  }

  try {
    const result = await runStaticExport({ promote: true })
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "static_export",
        entityType: "static_site",
        entityId: "github_pages",
        ip: "local",
        metadata: { counts: result.counts, changedFiles: result.changedFiles },
      },
    })
    return NextResponse.json({ ok: true, counts: result.counts, changedFiles: result.changedFiles })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Static export failed" },
      { status: 500 }
    )
  }
}

import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Props {
  searchParams: Promise<{ action?: string }>
}

export default async function AdminSecurityPage({ searchParams }: Props) {
  const currentSession = await getSession()
  const { action: actionFilter } = await searchParams

  const where: Record<string, unknown> = {}
  if (actionFilter) {
    where.action = { contains: actionFilter, mode: "insensitive" }
  }

  const [sessions, auditLogs] = await Promise.all([
    prisma.session.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.auditLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Security</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
          <div className="space-y-2">
            {sessions.map((session) => {
              const isCurrent = currentSession?.id === session.id
              const isActive = session.expiresAt > new Date()
              return (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border bg-[var(--bg-elevated)] ${
                    isCurrent ? "border-[var(--accent)]/30 bg-[var(--accent)]/5" : "border-[var(--border)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-[var(--text-secondary)]">
                        {session.userAgent || "Unknown device"}
                      </p>
                      {isCurrent && (
                        <Badge variant="default" className="text-[10px] font-mono">Current</Badge>
                      )}
                    </div>
                    <Badge variant={isActive ? "outline" : "secondary"} className="font-mono text-[10px]">
                      {isActive ? "Active" : "Expired"}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] font-mono mt-1">
                    Created: {session.createdAt.toLocaleString()}
                    {session.expiresAt && ` · Expires: ${session.expiresAt.toLocaleString()}`}
                  </p>
                </div>
              )
            })}
            {sessions.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)] font-mono">No sessions found.</p>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Audit Log</h2>
            {actionFilter && (
              <Link
                href="/security"
                className="text-xs font-mono text-[var(--accent)] hover:underline"
              >
                Clear filter
              </Link>
            )}
          </div>
          <div className="space-y-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2 rounded text-xs font-mono text-[var(--text-secondary)]"
              >
                <span className="text-[var(--accent)]">{log.action}</span>
                <span className="text-[var(--text-tertiary)]">
                  {" "}
                  &middot; {log.ip}
                  {log.user && ` · ${log.user.email}`}
                  · {log.createdAt.toLocaleString()}
                </span>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <p className="text-sm text-[var(--text-tertiary)] font-mono">
                {actionFilter ? "No logs match this filter." : "No audit logs found."}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

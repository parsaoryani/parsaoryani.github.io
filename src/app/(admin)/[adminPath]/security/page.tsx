import { prisma } from "@/lib/db/prisma"
import { Badge } from "@/components/ui/badge"

export default async function AdminSecurityPage() {
  const [sessions, auditLogs] = await Promise.all([
    prisma.session.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.auditLog.findMany({
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
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-[var(--text-secondary)]">
                    {session.userAgent || "Unknown device"}
                  </p>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {session.expiresAt > new Date() ? "Active" : "Expired"}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] font-mono mt-1">
                  IP: {session.ip || "Unknown"} &middot;{" "}
                  Created: {session.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Audit Log</h2>
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
                  {log.user && ` &middot; ${log.user.email}`}
                  &middot; {log.createdAt.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

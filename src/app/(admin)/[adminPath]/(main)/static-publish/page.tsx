import { redirect } from "next/navigation"
import { StaticPublishClient } from "./static-publish-client"
import { getSession } from "@/lib/auth/auth"
import { prisma } from "@/lib/db/prisma"

export default async function StaticPublishPage() {
  const session = await getSession()
  if (!session) redirect("/")
  if (session.user.role !== "owner") redirect("/")

  const [
    publications,
    projects,
    timelineEvents,
    skills,
    teaching,
    researching,
    media,
  ] = await Promise.all([
    prisma.publication.count({ where: { status: "published", deletedAt: null } }),
    prisma.project.count({ where: { status: "published", deletedAt: null } }),
    prisma.timelineEvent.count({ where: { visible: true } }),
    prisma.skill.count(),
    prisma.teachingAssistant.count({ where: { status: "published", deletedAt: null } }),
    prisma.researchingAssistant.count({ where: { status: "published", deletedAt: null } }),
    prisma.media.count(),
  ])

  const exportEnabled = process.env.NODE_ENV === "development" && process.env.ALLOW_LOCAL_STATIC_EXPORT === "1"

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Static Publish</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Export the public database snapshot used by the GitHub Pages build.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Publications", publications],
          ["Projects", projects],
          ["Timeline", timelineEvents],
          ["Skills", skills],
          ["Teaching", teaching],
          ["Research", researching],
          ["Media", media],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <p className="text-xs font-mono uppercase text-[var(--text-tertiary)]">{label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-cyan">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        <h2 className="text-sm font-semibold">Export status</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {exportEnabled
            ? "Local export is enabled for this development session."
            : "Local export is disabled. Start the app with NODE_ENV=development and ALLOW_LOCAL_STATIC_EXPORT=1."}
        </p>
        <div className="mt-5">
          {exportEnabled ? (
            <StaticPublishClient />
          ) : (
            <code className="block rounded bg-void/50 p-3 text-xs text-[var(--text-secondary)]">
              NODE_ENV=development ALLOW_LOCAL_STATIC_EXPORT=1 npm run dev
            </code>
          )}
        </div>
      </div>
    </div>
  )
}

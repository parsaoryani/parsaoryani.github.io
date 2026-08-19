import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, ExternalLink } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="projects/new">
          <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
            <Plus size={14} /> New Project
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate">{project.title}</h3>
                <Badge variant={project.status === "published" ? "success" : "warning"} className="font-mono text-[10px]">{project.status}</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono truncate">{project.summary}</p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Link href={`projects/${project.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
              </Link>
              <Link href={`/projects/${project.slug}`} target="_blank">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink size={14} /></Button>
              </Link>
              <DeleteButton id={project.id} type="projects" />
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No projects yet.</p>
        )}
      </div>
    </div>
  )
}

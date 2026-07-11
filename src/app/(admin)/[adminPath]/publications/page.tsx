import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminPublicationsPage() {
  const publications = await prisma.publication.findMany({
    where: { deletedAt: null },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link href="publications/new">
          <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
            <Plus size={14} /> New Publication
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {publications.map((pub) => (
          <div key={pub.id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate">{pub.title}</h3>
                <Badge variant={pub.status === "published" ? "success" : "warning"} className="font-mono text-[10px]">{pub.status}</Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono">{pub.venue} &middot; {pub.year}</p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Link href={`publications/${pub.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
              </Link>
              <Link href={`/research/${pub.slug}`} target="_blank">
                <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink size={14} /></Button>
              </Link>
              <DeleteButton id={pub.id} type="publications" />
            </div>
          </div>
        ))}
        {publications.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No publications yet.</p>
        )}
      </div>
    </div>
  )
}

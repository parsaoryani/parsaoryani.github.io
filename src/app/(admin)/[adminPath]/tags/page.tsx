import { prisma } from "@/lib/db/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { label: "asc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link href="tags/new">
          <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
            <Plus size={14} /> New Tag
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2 group">
            <Badge variant={tag.color === "indigo" ? "secondary" : "default"} className="font-mono text-xs">
              {tag.label}
            </Badge>
            <Link href={`tags/${tag.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit size={12} className="text-[var(--accent)]" />
            </Link>
            <DeleteButton id={tag.id} type="tags" />
          </div>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No tags yet.</p>
        )}
      </div>
    </div>
  )
}

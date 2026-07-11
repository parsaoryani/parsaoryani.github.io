import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Edit, ExternalLink } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminTeachingPage() {
  const items = await prisma.teachingAssistant.findMany({ orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }] })
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Teaching Assistance</h1>
        <Link href="teaching-assistance/new">
          <Button variant="default" size="sm" className="font-mono text-xs gap-1.5"><Plus size={14} /> New Entry</Button>
        </Link>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate">{item.course}</h3>
                <span className="text-xs text-[var(--text-tertiary)] font-mono">{item.university}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-mono">{item.professor} &middot; {new Date(item.startDate).getFullYear()}{item.endDate ? `-${new Date(item.endDate).getFullYear()}` : ""}</p>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Link href={`teaching-assistance/${item.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
              </Link>
              <DeleteButton id={item.id} type="teaching-assistance" />
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-[var(--text-tertiary)] font-mono">No entries yet.</p>}
      </div>
    </div>
  )
}

import { prisma } from "@/lib/db/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, GraduationCap, Briefcase, Award, Mic, HeartHandshake } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"

const typeConfig: Record<string, { icon: typeof GraduationCap; label: string; color: string }> = {
  education: { icon: GraduationCap, label: "Education", color: "text-cyan" },
  experience: { icon: Briefcase, label: "Experience", color: "text-indigo" },
  award: { icon: Award, label: "Awards", color: "text-emerald" },
  talk: { icon: Mic, label: "Talks", color: "text-amber" },
  service: { icon: HeartHandshake, label: "Service", color: "text-mist" },
}

export default async function AdminTimelinePage() {
  const events = await prisma.timelineEvent.findMany({
    orderBy: [{ startDate: "desc" }, { sortOrder: "asc" }],
  })

  const grouped: Record<string, typeof events> = {}
  for (const event of events) {
    if (!grouped[event.type]) grouped[event.type] = []
    grouped[event.type]!.push(event)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Timeline</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon
          const count = grouped[type]?.length || 0
          return (
            <a
              key={type}
              href={`#${type}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-xs font-mono hover:border-cyan/50 transition-colors"
            >
              <Icon size={12} className={config.color} />
              {config.label}
              <span className="text-[var(--text-tertiary)] ml-1">{count}</span>
            </a>
          )
        })}
      </div>

      {Object.entries(typeConfig).map(([type, config]) => {
        const Icon = config.icon
        const typeEvents = grouped[type] || []
        return (
          <div key={type} id={type} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Icon size={16} className={config.color} />
                {config.label}
                <span className="text-xs text-[var(--text-tertiary)] font-mono">{typeEvents.length}</span>
              </h2>
              <Link href={`timeline/new?type=${type}`}>
                <Button variant="default" size="sm" className="font-mono text-xs gap-1.5">
                  <Plus size={14} /> New {config.label}
                </Button>
              </Link>
            </div>
            {typeEvents.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] font-mono">No {config.label.toLowerCase()} events.</p>
            ) : (
              <div className="space-y-2">
                {typeEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
                    <div>
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] font-mono">
                        {event.organization}{event.location && ` — ${event.location}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`timeline/${event.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={14} /></Button>
                      </Link>
                      <DeleteButton id={event.id} type="timeline" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

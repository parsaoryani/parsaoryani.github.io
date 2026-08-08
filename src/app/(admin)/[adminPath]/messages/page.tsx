import { prisma } from "@/lib/db/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { MessageSquare, Trash2, Search, Eye, EyeOff } from "lucide-react"
import { MessageDeleteButton, MessageStatusButton } from "./actions"

const statusColors: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  new: "default",
  read: "secondary",
  archived: "outline",
  spam: "warning",
}

const statusLabels: Record<string, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
  spam: "Spam",
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { status: statusFilter, q: searchQuery } = await searchParams

  const where: Record<string, unknown> = {}
  if (statusFilter && statusFilter !== "all") {
    where.status = statusFilter
  }
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { email: { contains: searchQuery, mode: "insensitive" } },
      { subject: { contains: searchQuery, mode: "insensitive" } },
      { body: { contains: searchQuery, mode: "insensitive" } },
    ]
  }

  const [messages, counts] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.groupBy({
      by: ["status"],
      _count: true,
    }),
  ])

  const statusCounts = Object.fromEntries(counts.map((c) => [c.status, c._count]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <span className="text-xs text-[var(--text-tertiary)] font-mono">{messages.length} total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery || ""}
            placeholder="Search messages..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]/50 transition-colors"
          />
        </form>
        <div className="flex gap-1">
          {["all", "new", "read", "archived", "spam"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/messages" : `/messages?status=${s}`}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${
                (statusFilter || "all") === s
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {s === "all" ? "All" : statusLabels[s] || s}
              {statusCounts[s] ? ` (${statusCounts[s]})` : ""}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex items-start justify-between mb-2">
              <Link href={`messages/${msg.id}`} className="hover:text-[var(--accent)] transition-colors">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{msg.name}</h3>
                  <Badge variant={statusColors[msg.status] || "outline"} className="text-[10px]">
                    {statusLabels[msg.status] || msg.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-mono">{msg.email}</p>
              </Link>
              <div className="flex items-center gap-2">
                <MessageStatusButton id={msg.id} current={msg.status} />
                <MessageDeleteButton id={msg.id} />
              </div>
            </div>
            {msg.subject && (
              <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">{msg.subject}</p>
            )}
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{msg.body}</p>
            <p className="text-xs text-[var(--text-tertiary)] font-mono mt-2">
              {msg.createdAt.toLocaleDateString()} &middot; {msg.createdAt.toLocaleTimeString()}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">
            {searchQuery || statusFilter ? "No messages match your filters." : "No messages yet."}
          </p>
        )}
      </div>
    </div>
  )
}
import { prisma } from "@/lib/db/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, Trash2 } from "lucide-react"
import { MessageDeleteButton, MessageStatusButton } from "./actions"

const statusColors: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  new: "default",
  read: "secondary",
  archived: "outline",
  spam: "warning",
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <span className="text-xs text-[var(--text-tertiary)] font-mono">{messages.length} total</span>
      </div>

      <div className="space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex items-start justify-between mb-2">
              <Link href={`messages/${msg.id}`} className="hover:text-[var(--accent)] transition-colors">
                <h3 className="text-sm font-medium">{msg.name}</h3>
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
              {msg.createdAt.toLocaleDateString()} &middot; {msg.ip}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No messages yet.</p>
        )}
      </div>
    </div>
  )
}

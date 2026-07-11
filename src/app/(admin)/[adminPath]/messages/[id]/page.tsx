"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, "default" | "secondary" | "warning" | "outline"> = {
  new: "default",
  read: "secondary",
  archived: "outline",
  spam: "warning",
}

export default function MessageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [msg, setMsg] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/messages/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setMsg(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  async function updateStatus(status: string) {
    await fetch(`/api/messages/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setMsg({ ...msg, status })
  }

  async function handleDelete() {
    if (!confirm("Delete this message?")) return
    await fetch(`/api/messages/${params.id}`, { method: "DELETE" })
    router.push("..")
    router.refresh()
  }

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
  if (!msg) return <p className="text-sm text-[var(--danger)]">Not found</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Message</h1>
        <Button variant="ghost" onClick={() => router.back()}>← Back</Button>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">{msg.name}</h2>
              <a href={`mailto:${msg.email}`} className="text-sm text-[var(--accent)] font-mono hover:underline">{msg.email}</a>
            </div>
            <Badge variant={statusColors[msg.status] || "outline"}>{msg.status}</Badge>
          </div>

          {msg.subject && (
            <div className="mb-3">
              <p className="text-xs text-[var(--text-tertiary)] font-mono mb-1">SUBJECT</p>
              <p className="text-sm font-medium">{msg.subject}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs text-[var(--text-tertiary)] font-mono mb-1">MESSAGE</p>
            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
          </div>

          <p className="text-xs text-[var(--text-tertiary)] font-mono">
            {new Date(msg.createdAt).toLocaleString()} &middot; IP: {msg.ip}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {msg.status !== "read" && (
            <Button size="sm" variant="secondary" onClick={() => updateStatus("read")}>Mark as Read</Button>
          )}
          {msg.status !== "archived" && (
            <Button size="sm" variant="outline" onClick={() => updateStatus("archived")}>Archive</Button>
          )}
          {msg.status !== "spam" && (
            <Button size="sm" variant="ghost" onClick={() => updateStatus("spam")}>Mark as Spam</Button>
          )}
          <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

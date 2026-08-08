"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle, Archive, AlertTriangle } from "lucide-react"

export function MessageStatusButton({ id, current }: { id: string; current: string }) {
  const router = useRouter()

  const next = current === "new" ? "read" : current === "read" ? "archived" : "read"

  async function toggle() {
    const res = await fetch(`/api/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    if (!res.ok) return
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggle} title={`Mark as ${next}`}>
      {next === "read" ? <CheckCircle size={13} /> : next === "archived" ? <Archive size={13} /> : <AlertTriangle size={13} />}
    </Button>
  )
}

export function MessageDeleteButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this message?")) return
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" })
    if (!res.ok) return
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--danger)]" onClick={handleDelete}>
      <Trash2 size={13} />
    </Button>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export function TagsDeleteButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm("Delete this tag? This removes it from all publications and projects.")) return
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch {}
  }

  return (
    <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 transition-opacity">
      <Trash2 size={12} className="text-[var(--danger)]" />
    </button>
  )
}

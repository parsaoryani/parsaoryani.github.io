"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteButton({ id, type }: { id: string; type: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return
    const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" })
    if (!res.ok) return
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--danger)]" onClick={handleDelete}>
      <Trash2 size={14} />
    </Button>
  )
}

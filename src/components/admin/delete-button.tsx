"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export function DeleteButton({ id, type }: { id: string; type: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete this ${type.slice(0, -1)}?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete")
        setDeleting(false)
      }
    } catch {
      alert("Failed to delete")
      setDeleting(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--danger)]" onClick={handleDelete} disabled={deleting}>
      <Trash2 size={14} />
    </Button>
  )
}

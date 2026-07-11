"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditTagPage() {
  const router = useRouter()
  const params = useParams()
  const [tag, setTag] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((tags: any[]) => {
        const t = tags.find((t: any) => t.id === params.id)
        if (t) setTag(t)
        else setError("Tag not found")
        setLoading(false)
      })
      .catch(() => { setError("Failed to load"); setLoading(false) })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const data = {
      slug: form.get("slug") as string,
      label: form.get("label") as string,
      description: (form.get("description") as string) || undefined,
      color: (form.get("color") as string) || undefined,
    }
    try {
      const res = await fetch(`/api/tags/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch { setError("Failed to update") }
    finally { setSubmitting(false) }
  }

  async function handleDelete() {
    if (!confirm("Delete this tag? This will remove it from all publications and projects.")) return
    try {
      const res = await fetch(`/api/tags/${params.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch { setError("Failed to delete") }
  }

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
  if (!tag) return <p className="text-sm text-[var(--danger)]">Not found</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Tag</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="label">Label *</Label>
          <Input id="label" name="label" required defaultValue={tag.label} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={tag.slug} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" defaultValue={tag.description || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" name="color" defaultValue={tag.color || ""} />
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          </div>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewTagPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch { setError("Failed to create tag") }
    finally { setSubmitting(false) }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Tag</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="label">Label *</Label>
          <Input id="label" name="label" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required placeholder="my-tag" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color (Tailwind color name)</Label>
          <Input id="color" name="color" placeholder="cyan / indigo / emerald" />
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Tag"}</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}

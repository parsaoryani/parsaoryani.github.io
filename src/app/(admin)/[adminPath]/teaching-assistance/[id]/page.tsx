"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TAItem {
  id: string; slug: string; course: string; university: string; professor: string
  startDate: string; endDate: string | null; description: string | null
  highlights: string[]; technologies: string | null; status: string
}

export default function EditTeachingPage() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState<TAItem | null>(null)
  const [error, setError] = useState<string | null>(null); const [submitting, setSubmitting] = useState(false); const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/teaching-assistance/${params.id}`).then(r => r.json()).then(d => { setItem(d); setLoading(false) }).catch(() => { setError("Failed to load"); setLoading(false) })
  }, [params.id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const data = {
      course: form.get("course") as string, slug: form.get("slug") as string,
      university: form.get("university") as string, professor: form.get("professor") as string,
      startDate: form.get("startDate") as string, endDate: (form.get("endDate") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      highlights: (form.get("highlights") as string)?.split("\n").filter(Boolean) || [],
      technologies: (form.get("technologies") as string) || undefined,
      status: form.get("status") as string,
    }
    try {
      const res = await fetch(`/api/teaching-assistance/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); setError(typeof err.error === "string" ? err.error : "Failed"); return }
      router.push(".."); router.refresh()
    } catch { setError("Failed to update") } finally { setSubmitting(false) }
  }

  async function handleDelete() {
    if (!confirm("Delete this entry?")) return
    try { const res = await fetch(`/api/teaching-assistance/${params.id}`, { method: "DELETE" }); if (res.ok) { router.push(".."); router.refresh() } } catch {}
  }

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
  if (!item) return <p className="text-sm text-[var(--danger)]">Not found</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Teaching Assistance</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="course">Course *</Label><Input id="course" name="course" required defaultValue={item.course} /></div>
          <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" name="slug" required defaultValue={item.slug} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="university">University *</Label><Input id="university" name="university" required defaultValue={item.university} /></div>
          <div className="space-y-2"><Label htmlFor="professor">Professor *</Label><Input id="professor" name="professor" required defaultValue={item.professor} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="startDate">Start Date *</Label><Input id="startDate" name="startDate" type="date" required defaultValue={item.startDate?.slice(0, 10)} /></div>
          <div className="space-y-2"><Label htmlFor="endDate">End Date</Label><Input id="endDate" name="endDate" type="date" defaultValue={item.endDate?.slice(0, 10) || ""} /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="technologies">Technologies / Topics</Label><Input id="technologies" name="technologies" defaultValue={item.technologies || ""} /></div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={item.status}>
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} defaultValue={item.description || ""} /></div>
        <div className="space-y-2"><Label htmlFor="highlights">Highlights (one per line)</Label><Textarea id="highlights" name="highlights" rows={3} defaultValue={item.highlights?.join("\n") || ""} /></div>
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

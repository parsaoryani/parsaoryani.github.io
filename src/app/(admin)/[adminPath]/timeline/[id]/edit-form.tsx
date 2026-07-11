"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TimelineEvent = {
  id: string
  type: string
  title: string
  organization: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
  url: string | null
  visible: boolean
}

export function EditTimelineForm({ event }: { event: TimelineEvent }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const data = {
      type: form.get("type") as string,
      title: form.get("title") as string,
      organization: form.get("organization") as string,
      location: (form.get("location") as string) || undefined,
      startDate: form.get("startDate") as string,
      endDate: (form.get("endDate") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      url: (form.get("url") as string) || undefined,
      visible: form.get("visible") === "on",
    }
    try {
      const res = await fetch(`/api/timeline/${event.id}`, {
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
    if (!confirm("Delete this event?")) return
    try {
      const res = await fetch(`/api/timeline/${event.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch { setError("Failed to delete") }
  }

  const fmt = (d: string | null) => d ? d.split("T")[0] : ""

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Timeline Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={event.type}>
            <option value="education">Education</option>
            <option value="experience">Experience</option>
            <option value="award">Award</option>
            <option value="talk">Talk</option>
            <option value="service">Service</option>
            <option value="publication_milestone">Publication Milestone</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={event.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization *</Label>
          <Input id="organization" name="organization" required defaultValue={event.organization} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={event.location || ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input id="startDate" name="startDate" type="date" required defaultValue={fmt(event.startDate)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={fmt(event.endDate) || ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} defaultValue={event.description || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" defaultValue={event.url || ""} />
        </div>
        <div className="flex items-center gap-2">
          <input id="visible" name="visible" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan" defaultChecked={event.visible} />
          <Label htmlFor="visible">Visible on public site</Label>
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

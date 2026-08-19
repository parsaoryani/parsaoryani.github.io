"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function NewTimelineForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedType = searchParams.get("type") || "experience"
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
      highlights: (form.get("highlights") as string)?.split("\n").map((h) => h.trim()).filter(Boolean) || [],
      url: (form.get("url") as string) || undefined,
      visible: form.get("visible") === "on",
    }

    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch {
      setError("Failed to create event")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Timeline Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={preselectedType}>
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
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Organization *</Label>
          <Input id="organization" name="organization" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="date" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights <span className="text-[var(--text-tertiary)] font-mono text-xs">(one per line)</span></Label>
          <Textarea id="highlights" name="highlights" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" />
        </div>
        <div className="flex items-center gap-2">
          <input id="visible" name="visible" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan" defaultChecked />
          <Label htmlFor="visible">Visible on public site</Label>
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Event"}</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}

export default function NewTimelinePage() {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--text-secondary)]">Loading...</p>}>
      <NewTimelineForm />
    </Suspense>
  )
}

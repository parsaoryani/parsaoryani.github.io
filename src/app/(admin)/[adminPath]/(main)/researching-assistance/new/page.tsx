"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewResearchingPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const data = {
      lab: form.get("lab") as string, slug: form.get("slug") as string,
      university: form.get("university") as string, supervisor: form.get("supervisor") as string,
      topic: form.get("topic") as string,
      startDate: form.get("startDate") as string, endDate: (form.get("endDate") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      outcomes: (form.get("outcomes") as string)?.split("\n").filter(Boolean) || [],
      technologies: (form.get("technologies") as string) || undefined,
      status: form.get("status") as string,
    }
    try {
      const res = await fetch("/api/researching-assistance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); setError(typeof err.error === "string" ? err.error : Object.values(err.error).flat().join("; ") || "Validation failed"); return }
      router.push(".."); router.refresh()
    } catch { setError("Failed to create") } finally { setSubmitting(false) }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Research Experience</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="topic">Research Topic *</Label><Input id="topic" name="topic" required placeholder="e.g. Formal Verification of ZK-Rollups" /></div>
          <div className="space-y-2"><Label htmlFor="slug">Slug *</Label><Input id="slug" name="slug" required placeholder="zk-rollup-verification-ra" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="lab">Lab *</Label><Input id="lab" name="lab" required placeholder="Security Lab" /></div>
          <div className="space-y-2"><Label htmlFor="university">University *</Label><Input id="university" name="university" required placeholder="Sharif University of Technology" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="supervisor">Supervisor *</Label><Input id="supervisor" name="supervisor" required placeholder="Dr. Supervisor" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="startDate">Start Date *</Label><Input id="startDate" name="startDate" type="date" required /></div>
          <div className="space-y-2"><Label htmlFor="endDate">End Date</Label><Input id="endDate" name="endDate" type="date" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="technologies">Technologies</Label><Input id="technologies" name="technologies" placeholder="Rust, Z3, Python" /></div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue="draft">
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} /></div>
        <div className="space-y-2"><Label htmlFor="outcomes">Outcomes / Publications (one per line)</Label><Textarea id="outcomes" name="outcomes" rows={3} placeholder="Paper submitted to IEEE S&amp;P&#10;Tool released on GitHub&#10;..." /></div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Entry"}</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}

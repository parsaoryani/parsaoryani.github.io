"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewProjectPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const data = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      summary: form.get("summary") as string,
      role: (form.get("role") as string) || undefined,
      status: form.get("status") as string,
      year: parseInt(form.get("year") as string),
      problem: (form.get("problem") as string) || undefined,
      approach: (form.get("approach") as string) || undefined,
      repoUrl: (form.get("repoUrl") as string) || undefined,
      demoUrl: (form.get("demoUrl") as string) || undefined,
      featured: form.get("featured") === "on",
      techStack: (form.get("techStack") as string)
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(typeof err.error === "string" ? err.error : "Validation failed")
        return
      }
      router.push("..")
      router.refresh()
    } catch {
      setError("Failed to create project")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required placeholder="my-project" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary *</Label>
          <Textarea id="summary" name="summary" required rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" placeholder="Lead Developer" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input id="year" name="year" type="number" required defaultValue={2025} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog"
            defaultValue="draft"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="problem">Problem</Label>
          <Textarea id="problem" name="problem" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approach">Approach</Label>
          <Textarea id="approach" name="approach" rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
          <Input id="techStack" name="techStack" placeholder="Rust, Z3, Docker" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repoUrl">Repo URL</Label>
            <Input id="repoUrl" name="repoUrl" type="url" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input id="demoUrl" name="demoUrl" type="url" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan"
          />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Project"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewPublicationPage() {
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
      venue: form.get("venue") as string,
      venueType: form.get("venueType") as string,
      year: parseInt(form.get("year") as string),
      status: form.get("status") as string,
      abstract: (form.get("abstract") as string) || undefined,
      tldr: (form.get("tldr") as string) || undefined,
      doi: (form.get("doi") as string) || undefined,
      arxivId: (form.get("arxivId") as string) || undefined,
      pdfUrl: (form.get("pdfUrl") as string) || undefined,
      codeUrl: (form.get("codeUrl") as string) || undefined,
      projectUrl: (form.get("projectUrl") as string) || undefined,
      bibtex: (form.get("bibtex") as string) || undefined,
      featured: form.get("featured") === "on",
      authors: [{ name: form.get("authors") as string }],
      contributions: [],
    }

    try {
      const res = await fetch("/api/publications", {
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
      setError("Failed to create publication")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Publication</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required placeholder="my-paper-title" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input id="venue" name="venue" required placeholder="NeurIPS 2025" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueType">Venue Type</Label>
            <select
              id="venueType"
              name="venueType"
              className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog"
              defaultValue="conference"
            >
              <option value="conference">Conference</option>
              <option value="journal">Journal</option>
              <option value="workshop">Workshop</option>
              <option value="preprint">Preprint</option>
              <option value="poster">Poster</option>
              <option value="talk">Talk</option>
              <option value="thesis">Thesis</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input id="year" name="year" type="number" required defaultValue={2025} />
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="authors">Authors (comma-separated)</Label>
          <Input id="authors" name="authors" placeholder="Parsa Oryani, Coauthor Name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="abstract">Abstract</Label>
          <Textarea id="abstract" name="abstract" rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tldr">TL;DR</Label>
          <Input id="tldr" name="tldr" placeholder="One-line summary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doi">DOI</Label>
            <Input id="doi" name="doi" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arxivId">arXiv ID</Label>
            <Input id="arxivId" name="arxivId" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdfUrl">PDF URL</Label>
          <Input id="pdfUrl" name="pdfUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codeUrl">Code URL</Label>
          <Input id="codeUrl" name="codeUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectUrl">Project URL</Label>
          <Input id="projectUrl" name="projectUrl" type="url" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bibtex">BibTeX</Label>
          <Textarea id="bibtex" name="bibtex" rows={6} className="font-mono text-xs" />
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
            {submitting ? "Creating..." : "Create Publication"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

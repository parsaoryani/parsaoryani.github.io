"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils/cn"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface Author {
  name: string
  isMe: boolean
}

interface Publication {
  id: string
  title: string
  slug: string
  venue: string
  venueType: string
  year: number
  status: string
  abstract: string | null
  tldr: string | null
  doi: string | null
  arxivId: string | null
  pdfUrl: string | null
  codeUrl: string | null
  projectUrl: string | null
  bibtex: string | null
  citationCount: number | null
  featured: boolean
  sortOrder: number
  ogImageUrl: string | null
  version: number
  authors: Author[]
  contributions: string[]
  tags: { tag: { id: string; label: string } }[]
}

export default function EditPublicationPage() {
  const router = useRouter()
  const params = useParams()
  const [pub, setPub] = useState<Publication | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/publications/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPub({
          ...data,
          authors: (data.authors || []) as Author[],
          contributions: (data.contributions || []) as string[],
        })
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load publication")
        setLoading(false)
      })
  }, [params.id])

  function addAuthor() {
    setPub((p) => (p ? { ...p, authors: [...p.authors, { name: "", isMe: false }] } : null))
  }

  function removeAuthor(index: number) {
    setPub((p) => (p ? { ...p, authors: p.authors.filter((_, i) => i !== index) } : null))
  }

  function updateAuthor(index: number, field: "name" | "isMe", value: string | boolean) {
    setPub((p) => {
      if (!p) return null
      const authors = [...p.authors]
      authors[index] = { ...authors[index], [field]: value } as Author
      return { ...p, authors }
    })
  }

  function addContribution() {
    setPub((p) => (p ? { ...p, contributions: [...p.contributions, ""] } : null))
  }

  function removeContribution(index: number) {
    setPub((p) => (p ? { ...p, contributions: p.contributions.filter((_, i) => i !== index) } : null))
  }

  function updateContribution(index: number, value: string) {
    setPub((p) => {
      if (!p) return null
      const contributions = [...p.contributions]
      contributions[index] = value
      return { ...p, contributions }
    })
  }

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
      citationCount: form.get("citationCount") ? parseInt(form.get("citationCount") as string) : undefined,
      featured: form.get("featured") === "on",
      sortOrder: form.get("sortOrder") ? parseInt(form.get("sortOrder") as string) : 0,
      ogImageUrl: (form.get("ogImageUrl") as string) || undefined,
      version: pub?.version ?? 1,
      authors: (pub?.authors || []).map((a: { name?: string; isMe?: boolean }) => ({ name: a.name ?? "", isMe: a.isMe ?? false })) as Author[],
      contributions: pub?.contributions || [],
      tagIds: [],
    }

    try {
      const res = await fetch(`/api/publications/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(typeof err.error === "string" ? err.error : Object.values(err.error).flat().join("; ") || "Validation failed")
        return
      }
      router.push("..")
      router.refresh()
    } catch {
      setError("Failed to update publication")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this publication?")) return
    try {
      const res = await fetch(`/api/publications/${params.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      router.push("..")
      router.refresh()
    } catch {
      setError("Failed to delete")
    }
  }

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
  if (!pub) return <p className="text-sm text-[var(--danger)]">Not found</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Publication</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={pub.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={pub.slug} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue *</Label>
            <Input id="venue" name="venue" required defaultValue={pub.venue} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueType">Venue Type</Label>
            <select
              id="venueType"
              name="venueType"
              className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog"
              defaultValue={pub.venueType}
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
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input id="year" name="year" type="number" required defaultValue={pub.year} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog"
              defaultValue={pub.status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={pub.sortOrder} />
          </div>
        </div>

        <div className="space-y-2 border-t border-[var(--border)] pt-4">
          <Label className="font-semibold">Authors (ordered)</Label>
          {pub.authors.map((author, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GripVertical size={16} className="text-[var(--text-tertiary)] cursor-grab" />
              <div className="flex-1 space-y-1">
                <Input
                  placeholder={`Author ${idx + 1} name`}
                  defaultValue={author.name}
                  onChange={(e) => updateAuthor(idx, "name", e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    defaultChecked={author.isMe}
                    onChange={(e) => updateAuthor(idx, "isMe", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan"
                  />
                  Is me
                </label>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAuthor(idx)}
                disabled={pub.authors.length <= 1}
                aria-label={`Remove author ${idx + 1}`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addAuthor}>
            <Plus size={14} className="mr-1" /> Add Author
          </Button>
        </div>

        <div className="space-y-2 border-t border-[var(--border)] pt-4">
          <Label className="font-semibold">Contributions (ordered list)</Label>
          {pub.contributions.map((contrib, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GripVertical size={16} className="text-[var(--text-tertiary)] cursor-grab" />
              <Input
                placeholder={`Contribution ${idx + 1}`}
                defaultValue={contrib}
                onChange={(e) => updateContribution(idx, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeContribution(idx)}
                disabled={pub.contributions.length <= 1}
                aria-label={`Remove contribution ${idx + 1}`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addContribution}>
            <Plus size={14} className="mr-1" /> Add Contribution
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="abstract">Abstract</Label>
          <Textarea id="abstract" name="abstract" rows={4} defaultValue={pub.abstract || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tldr">TL;DR</Label>
          <Input id="tldr" name="tldr" defaultValue={pub.tldr || ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doi">DOI</Label>
            <Input id="doi" name="doi" defaultValue={pub.doi || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arxivId">arXiv ID</Label>
            <Input id="arxivId" name="arxivId" defaultValue={pub.arxivId || ""} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">PDF URL</Label>
            <Input id="pdfUrl" name="pdfUrl" type="url" defaultValue={pub.pdfUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeUrl">Code URL</Label>
            <Input id="codeUrl" name="codeUrl" type="url" defaultValue={pub.codeUrl || ""} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input id="projectUrl" name="projectUrl" type="url" defaultValue={pub.projectUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="citationCount">Citation Count</Label>
            <Input id="citationCount" name="citationCount" type="number" min="0" defaultValue={pub.citationCount || ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bibtex">BibTeX</Label>
          <Textarea id="bibtex" name="bibtex" rows={6} className="font-mono text-xs" defaultValue={pub.bibtex || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogImageUrl">OG Image URL</Label>
          <Input id="ogImageUrl" name="ogImageUrl" type="url" defaultValue={pub.ogImageUrl || ""} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan"
            defaultChecked={pub.featured}
          />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
        <input type="hidden" name="version" value={pub.version} />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </form>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EditorLayout, type Breadcrumb } from "@/components/admin/editor-layout"
import { FieldGroup, SectionHeader } from "@/components/admin/field-group"
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
  createdAt: string
  updatedAt: string
}

const breadcrumbs: Breadcrumb[] = [
  { label: "Admin", href: "/x7k2-console" },
  { label: "Publications", href: "/x7k2-console/publications" },
  { label: "Edit" },
]

export default function EditPublicationPage() {
  const router = useRouter()
  const params = useParams()
  const [pub, setPub] = useState<Publication | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authors, setAuthors] = useState<Author[]>([{ name: "", isMe: false }])
  const [contributions, setContributions] = useState<string[]>([""])

  useEffect(() => {
    fetch(`/api/publications/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPub(data)
        setAuthors((data.authors || []).map((a: { name?: string; isMe?: boolean }) => ({ name: a.name ?? "", isMe: a.isMe ?? false })))
        setContributions(data.contributions || [""])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load publication")
        setLoading(false)
      })
  }, [params.id])

  function addAuthor() {
    setAuthors([...authors, { name: "", isMe: false }])
  }

  function removeAuthor(index: number) {
    setAuthors(authors.filter((_, i) => i !== index))
  }

  function updateAuthor(index: number, field: "name" | "isMe", value: string | boolean) {
    const next = [...authors]
    next[index] = { ...next[index], [field]: value } as Author
    setAuthors(next)
  }

  function addContribution() {
    setContributions([...contributions, ""])
  }

  function removeContribution(index: number) {
    setContributions(contributions.filter((_, i) => i !== index))
  }

  function updateContribution(index: number, value: string) {
    const next = [...contributions]
    next[index] = value
    setContributions(next)
  }

  async function handleSave() {
    setError(null)
    setFieldErrors(null)
    setSubmitting(true)

    const form = document.querySelector("form")!
    const fd = new FormData(form)
    const data = {
      title: fd.get("title") as string,
      slug: fd.get("slug") as string,
      venue: fd.get("venue") as string,
      venueType: fd.get("venueType") as string,
      year: parseInt(fd.get("year") as string),
      status: fd.get("status") as string,
      abstract: (fd.get("abstract") as string) || undefined,
      tldr: (fd.get("tldr") as string) || undefined,
      doi: (fd.get("doi") as string) || undefined,
      arxivId: (fd.get("arxivId") as string) || undefined,
      pdfUrl: (fd.get("pdfUrl") as string) || undefined,
      codeUrl: (fd.get("codeUrl") as string) || undefined,
      projectUrl: (fd.get("projectUrl") as string) || undefined,
      bibtex: (fd.get("bibtex") as string) || undefined,
      citationCount: fd.get("citationCount") ? parseInt(fd.get("citationCount") as string) : undefined,
      featured: fd.get("featured") === "on",
      sortOrder: fd.get("sortOrder") ? parseInt(fd.get("sortOrder") as string) : 0,
      ogImageUrl: (fd.get("ogImageUrl") as string) || undefined,
      version: pub?.version ?? 1,
      authors,
      contributions: contributions.filter((c) => c.trim()),
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
        if (typeof err.error === "object") {
          setFieldErrors(err.error)
        } else {
          setError(err.error || "Save failed")
        }
        return
      }
      const updated = await res.json()
      setPub(updated)
      setAuthors((updated.authors || []).map((a: { name?: string; isMe?: boolean }) => ({ name: a.name ?? "", isMe: a.isMe ?? false })))
      setContributions(updated.contributions || [""])
      router.refresh()
    } catch {
      setError("Failed to save publication")
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
    <EditorLayout
      title={pub.title}
      breadcrumbs={breadcrumbs}
      status={pub.status as "draft" | "published"}
      version={pub.version}
      savedAt={pub.updatedAt}
      error={error}
      fieldErrors={fieldErrors}
      submitting={submitting}
      onDelete={handleDelete}
      onSave={handleSave}
    >
      <FieldGroup label="Title" required>
        <Input name="title" required defaultValue={pub.title} />
      </FieldGroup>
      <FieldGroup label="Slug" required>
        <Input name="slug" required defaultValue={pub.slug} />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Venue" required>
          <Input name="venue" required defaultValue={pub.venue} />
        </FieldGroup>
        <FieldGroup label="Venue Type">
          <select name="venueType" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={pub.venueType}>
            <option value="conference">Conference</option>
            <option value="journal">Journal</option>
            <option value="workshop">Workshop</option>
            <option value="preprint">Preprint</option>
            <option value="poster">Poster</option>
            <option value="talk">Talk</option>
            <option value="thesis">Thesis</option>
          </select>
        </FieldGroup>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup label="Year" required>
          <Input name="year" type="number" required defaultValue={pub.year} />
        </FieldGroup>
        <FieldGroup label="Status">
          <select name="status" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={pub.status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Sort Order">
          <Input name="sortOrder" type="number" defaultValue={pub.sortOrder} />
        </FieldGroup>
      </div>

      <SectionHeader title="Authors" description="Ordered list of authors" />
      {authors.map((author, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <GripVertical size={16} className="text-[var(--text-tertiary)]" />
          <div className="flex-1 space-y-1">
            <Input
              placeholder={`Author ${idx + 1} name`}
              value={author.name}
              onChange={(e) => updateAuthor(idx, "name", e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={author.isMe}
                onChange={(e) => updateAuthor(idx, "isMe", e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan"
              />
              Is me
            </label>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => removeAuthor(idx)} disabled={authors.length <= 1} aria-label={`Remove author ${idx + 1}`}>
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addAuthor}>
        <Plus size={14} className="mr-1" /> Add Author
      </Button>

      <SectionHeader title="Contributions" description="Ordered list of contributions" />
      {contributions.map((contrib, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <GripVertical size={16} className="text-[var(--text-tertiary)]" />
          <Input
            placeholder={`Contribution ${idx + 1}`}
            value={contrib}
            onChange={(e) => updateContribution(idx, e.target.value)}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => removeContribution(idx)} disabled={contributions.length <= 1} aria-label={`Remove contribution ${idx + 1}`}>
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addContribution}>
        <Plus size={14} className="mr-1" /> Add Contribution
      </Button>

      <SectionHeader title="Abstract & Summary" />
      <FieldGroup label="Abstract">
        <Textarea name="abstract" rows={4} defaultValue={pub.abstract || ""} />
      </FieldGroup>
      <FieldGroup label="TL;DR">
        <Input name="tldr" defaultValue={pub.tldr || ""} />
      </FieldGroup>

      <SectionHeader title="Identifiers & Links" />
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="DOI">
          <Input name="doi" defaultValue={pub.doi || ""} />
        </FieldGroup>
        <FieldGroup label="arXiv ID">
          <Input name="arxivId" defaultValue={pub.arxivId || ""} />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="PDF URL">
          <Input name="pdfUrl" type="url" defaultValue={pub.pdfUrl || ""} />
        </FieldGroup>
        <FieldGroup label="Code URL">
          <Input name="codeUrl" type="url" defaultValue={pub.codeUrl || ""} />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Project URL">
          <Input name="projectUrl" type="url" defaultValue={pub.projectUrl || ""} />
        </FieldGroup>
        <FieldGroup label="Citation Count">
          <Input name="citationCount" type="number" min="0" defaultValue={pub.citationCount || ""} />
        </FieldGroup>
      </div>

      <SectionHeader title="BibTeX" />
      <FieldGroup label="BibTeX Entry">
        <Textarea name="bibtex" rows={6} className="font-mono text-xs" defaultValue={pub.bibtex || ""} />
      </FieldGroup>

      <SectionHeader title="SEO & Display" />
      <FieldGroup label="OG Image URL" hint="Social media share image">
        <Input name="ogImageUrl" type="url" defaultValue={pub.ogImageUrl || ""} placeholder="https://..." />
      </FieldGroup>
      <div className="flex items-center gap-2">
        <input id="featured" name="featured" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan" defaultChecked={pub.featured} />
        <Label htmlFor="featured">Featured on homepage</Label>
      </div>
    </EditorLayout>
  )
}
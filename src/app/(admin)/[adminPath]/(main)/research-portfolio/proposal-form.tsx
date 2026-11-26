"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type ProposalFormValue = {
  id?: string
  slug: string
  title: string
  kind: "thesis_proposal" | "research_proposal" | "concept_note"
  stage: "in_preparation" | "active" | "archived"
  year: number
  versionLabel: string
  summary: string
  themes: string[]
  motivation: string | null
  researchQuestion: string | null
  approach: string | null
  expectedContributions: string | null
  limitations: string | null
  pdfUrl: string | null
  status: "draft" | "published"
  featured: boolean
  sortOrder: number
  version: number
}

const blank: ProposalFormValue = {
  slug: "", title: "", kind: "research_proposal", stage: "in_preparation",
  year: new Date().getFullYear(), versionLabel: "v0.1", summary: "", themes: [],
  motivation: null, researchQuestion: null, approach: null, expectedContributions: null,
  limitations: null, pdfUrl: null, status: "draft", featured: false, sortOrder: 0, version: 1,
}

export function ResearchProposalForm({ initial = blank }: { initial?: ProposalFormValue }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    const form = new FormData(event.currentTarget)
    const nullable = (name: string) => String(form.get(name) ?? "") || null
    const payload = {
      slug: form.get("slug"), title: form.get("title"), kind: form.get("kind"), stage: form.get("stage"),
      year: Number(form.get("year")), versionLabel: form.get("versionLabel"), summary: form.get("summary"),
      themes: String(form.get("themes") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      motivation: nullable("motivation"), researchQuestion: nullable("researchQuestion"),
      approach: nullable("approach"), expectedContributions: nullable("expectedContributions"),
      limitations: nullable("limitations"), pdfUrl: nullable("pdfUrl"), status: form.get("status"),
      featured: form.get("featured") === "on", sortOrder: Number(form.get("sortOrder")), version: initial.version,
    }
    const response = await fetch(initial.id ? `/api/research-proposals/${initial.id}` : "/api/research-proposals", {
      method: initial.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    })
    const body = await response.json()
    if (!response.ok) {
      setError(typeof body.error === "string" ? body.error : Object.values(body.error ?? {}).flat().join("; "))
      setSaving(false)
      return
    }
    router.push("../..")
    router.refresh()
  }

  async function remove() {
    if (!initial.id || !window.confirm("Delete this proposal?")) return
    const response = await fetch(`/api/research-proposals/${initial.id}`, { method: "DELETE" })
    if (response.ok) { router.push("../.."); router.refresh() }
    else setError("Failed to delete proposal")
  }

  const fields: Array<[keyof ProposalFormValue, string, number]> = [
    ["summary", "Public summary", 4], ["motivation", "Motivation", 5],
    ["researchQuestion", "Research question", 4], ["approach", "Approach", 6],
    ["expectedContributions", "Expected contributions", 5], ["limitations", "Limitations and open questions", 4],
  ]

  return (
    <form onSubmit={submit} className="max-w-4xl space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required defaultValue={initial.title} /></div>
        <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" required defaultValue={initial.slug} placeholder="secure-agent-memory" /></div>
        <div className="space-y-2"><Label htmlFor="kind">Kind</Label><select id="kind" name="kind" defaultValue={initial.kind} className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3"><option value="thesis_proposal">Thesis Proposal</option><option value="research_proposal">Research Proposal</option><option value="concept_note">Concept Note</option></select></div>
        <div className="space-y-2"><Label htmlFor="stage">Stage</Label><select id="stage" name="stage" defaultValue={initial.stage} className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3"><option value="in_preparation">In preparation</option><option value="active">Active</option><option value="archived">Archived</option></select></div>
        <div className="space-y-2"><Label htmlFor="year">Year</Label><Input id="year" name="year" type="number" required defaultValue={initial.year} /></div>
        <div className="space-y-2"><Label htmlFor="versionLabel">Public version label</Label><Input id="versionLabel" name="versionLabel" required defaultValue={initial.versionLabel} /></div>
      </div>
      {fields.map(([name, label, rows]) => <div key={name} className="space-y-2"><Label htmlFor={name}>{label}</Label><Textarea id={name} name={name} required={name === "summary"} rows={rows} defaultValue={String(initial[name] ?? "")} /></div>)}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="themes">Themes (comma-separated)</Label><Input id="themes" name="themes" defaultValue={initial.themes.join(", ")} /></div>
        <div className="space-y-2"><Label htmlFor="pdfUrl">Sanitized public PDF URL</Label><Input id="pdfUrl" name="pdfUrl" defaultValue={initial.pdfUrl ?? ""} /></div>
        <div className="space-y-2"><Label htmlFor="status">Visibility</Label><select id="status" name="status" defaultValue={initial.status} className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3"><option value="draft">Draft</option><option value="published">Published</option></select></div>
        <div className="space-y-2"><Label htmlFor="sortOrder">Sort order</Label><Input id="sortOrder" name="sortOrder" type="number" defaultValue={initial.sortOrder} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={initial.featured} /> Featured proposal</label>
      {error && <p className="text-sm text-[var(--danger)]" role="alert">{error}</p>}
      <div className="flex gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save proposal"}</Button>{initial.id && <Button type="button" variant="danger" onClick={remove}>Delete</Button>}</div>
    </form>
  )
}

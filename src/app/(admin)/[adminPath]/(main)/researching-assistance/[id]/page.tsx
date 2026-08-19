"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EditorLayout, type Breadcrumb } from "@/components/admin/editor-layout"
import { FieldGroup, SectionHeader } from "@/components/admin/field-group"

interface RAItem {
  id: string; slug: string; lab: string | null; university: string; supervisor: string | null; topic: string
  startDate: string; endDate: string | null; description: string | null
  outcomes: string[]; technologies: string | null; repoUrl: string | null; status: string
  createdAt: string; updatedAt: string
}

const breadcrumbs: Breadcrumb[] = [
  { label: "Admin", href: "/x7k2-console" },
  { label: "Research Experience", href: "/x7k2-console/researching-assistance" },
  { label: "Edit" },
]

export default function EditResearchingPage() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState<RAItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/researching-assistance/${params.id}`)
      .then(r => r.json())
      .then(d => { setItem(d); setLoading(false) })
      .catch(() => { setError("Failed to load"); setLoading(false) })
  }, [params.id])

  async function handleSave() {
    setError(null)
    setFieldErrors(null)
    setSubmitting(true)

    const form = document.querySelector("form")!
    const fd = new FormData(form)
    const data = {
      lab: (fd.get("lab") as string) || undefined,
      slug: fd.get("slug") as string,
      university: fd.get("university") as string,
      supervisor: (fd.get("supervisor") as string) || undefined,
      topic: fd.get("topic") as string,
      startDate: fd.get("startDate") as string,
      endDate: (fd.get("endDate") as string) || undefined,
      description: (fd.get("description") as string) || undefined,
      outcomes: (fd.get("outcomes") as string)?.split("\n").filter(Boolean) || [],
      technologies: (fd.get("technologies") as string) || undefined,
      repoUrl: (fd.get("repoUrl") as string) || undefined,
      status: fd.get("status") as string,
    }

    try {
      const res = await fetch(`/api/researching-assistance/${params.id}`, {
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
      setItem(updated)
      router.refresh()
    } catch {
      setError("Failed to update")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this entry?")) return
    try {
      const res = await fetch(`/api/researching-assistance/${params.id}`, { method: "DELETE" })
      if (res.ok) { router.push(".."); router.refresh() }
    } catch { setError("Failed to delete") }
  }

  if (loading) return <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
  if (!item) return <p className="text-sm text-[var(--danger)]">Not found</p>

  return (
    <EditorLayout
      title={item.topic}
      breadcrumbs={breadcrumbs}
      status={item.status as "draft" | "published"}
      savedAt={item.updatedAt}
      error={error}
      fieldErrors={fieldErrors}
      submitting={submitting}
      onDelete={handleDelete}
      onSave={handleSave}
    >
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Research Topic" required>
          <Input name="topic" required defaultValue={item.topic} />
        </FieldGroup>
        <FieldGroup label="Slug" required>
          <Input name="slug" required defaultValue={item.slug} />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Lab">
          <Input name="lab" defaultValue={item.lab || ""} />
        </FieldGroup>
        <FieldGroup label="University" required>
          <Input name="university" required defaultValue={item.university} />
        </FieldGroup>
      </div>
      <FieldGroup label="Supervisor">
        <Input name="supervisor" defaultValue={item.supervisor || ""} />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Start Date" required>
          <Input name="startDate" type="date" required defaultValue={item.startDate?.slice(0, 10)} />
        </FieldGroup>
        <FieldGroup label="End Date">
          <Input name="endDate" type="date" defaultValue={item.endDate?.slice(0, 10) || ""} />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Technologies">
          <Input name="technologies" defaultValue={item.technologies || ""} placeholder="e.g. Rust, Z3, Smart Contracts" />
        </FieldGroup>
        <FieldGroup label="Status">
          <select name="status" className="flex h-11 w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-fog" defaultValue={item.status}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FieldGroup>
      </div>
      <FieldGroup label="Repository URL">
        <Input name="repoUrl" type="url" defaultValue={item.repoUrl || ""} placeholder="https://github.com/..." />
      </FieldGroup>

      <SectionHeader title="Description" />
      <FieldGroup label="Description">
        <Textarea name="description" rows={3} defaultValue={item.description || ""} />
      </FieldGroup>

      <SectionHeader title="Outcomes" description="One outcome per line" />
      <FieldGroup label="Outcomes" hint="Each line becomes a separate bullet point">
        <Textarea name="outcomes" rows={4} defaultValue={item.outcomes?.join("\n") || ""} placeholder="Published paper at conference&#10;Developed novel verification tool&#10;Achieved 95% test coverage" />
      </FieldGroup>
    </EditorLayout>
  )
}
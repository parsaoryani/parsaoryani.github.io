"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Agenda = {
  headline: string
  summary: string
  themes: string[]
  description: string | null
  documentUrl: string | null
  status: "draft" | "published"
  version: number
} | null

export function AgendaForm({ initial }: { initial: Agenda }) {
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)
    const form = new FormData(event.currentTarget)
    const response = await fetch("/api/research-agenda", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headline: form.get("headline"),
        summary: form.get("summary"),
        themes: String(form.get("themes") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        description: form.get("description"),
        documentUrl: form.get("documentUrl"),
        status: form.get("status"),
        version: initial?.version ?? 1,
      }),
    })
    const body = await response.json()
    setMessage(response.ok ? "Agenda saved." : typeof body.error === "string" ? body.error : "Please review the fields.")
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Research Agenda</h2>
        <select name="status" defaultValue={initial?.status ?? "draft"} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm">
          <option value="draft">Draft</option><option value="published">Published</option>
        </select>
      </div>
      <div className="space-y-2"><Label htmlFor="headline">Headline</Label><Input id="headline" name="headline" required defaultValue={initial?.headline ?? ""} /></div>
      <div className="space-y-2"><Label htmlFor="summary">Short summary</Label><Textarea id="summary" name="summary" required defaultValue={initial?.summary ?? ""} rows={4} /></div>
      <div className="space-y-2"><Label htmlFor="themes">Themes (comma-separated)</Label><Input id="themes" name="themes" defaultValue={initial?.themes.join(", ") ?? ""} /></div>
      <div className="space-y-2"><Label htmlFor="description">Longer framing</Label><Textarea id="description" name="description" defaultValue={initial?.description ?? ""} rows={5} /></div>
      <div className="space-y-2"><Label htmlFor="documentUrl">Agenda document URL</Label><Input id="documentUrl" name="documentUrl" defaultValue={initial?.documentUrl ?? ""} placeholder="/research/agenda.pdf or https://…" /></div>
      {message && <p className="text-sm text-[var(--text-secondary)]" role="status">{message}</p>}
      <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save agenda"}</Button>
    </form>
  )
}

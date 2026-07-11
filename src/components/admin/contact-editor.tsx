"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface Setting {
  id: string
  key: string
  value: unknown
}

export function ContactEditor({
  description,
  emails,
  links,
  location,
  settings,
}: {
  description: { text: string } | null
  emails: Array<{ label: string; address: string }> | null
  links: Array<{ label: string; url: string; desc: string }> | null
  location: { city: string; note: string } | null
  settings: Setting[]
}) {
  const router = useRouter()
  const [desc, setDesc] = useState(description?.text ?? "")
  const [emailList, setEmailList] = useState<Array<{ label: string; address: string }>>(
    emails ?? [{ label: "Academic", address: "parsa.oryani82@sharif.edu" }]
  )
  const [linkList, setLinkList] = useState<Array<{ label: string; url: string; desc: string }>>(
    links ?? [{ label: "GitHub", url: "https://github.com/parsaoryani", desc: "@parsaoryani" }]
  )
  const [city, setCity] = useState(location?.city ?? "Tehran, Iran")
  const [note, setNote] = useState(location?.note ?? "Available for virtual meetings worldwide")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const findId = (key: string) => settings.find((s) => s.key === key)?.id

  async function saveAll() {
    setSaving(true)
    setMsg(null)
    try {
      const updates = [
        { id: findId("contact_description"), key: "contact_description", value: { text: desc } },
        { id: findId("contact_emails"), key: "contact_emails", value: emailList },
        { id: findId("contact_links"), key: "contact_links", value: linkList },
        { id: findId("contact_location"), key: "contact_location", value: { city, note } },
      ]
      await Promise.all(
        updates.map((u) =>
          fetch(`/api/settings/${u.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: u.value }),
          })
        )
      )
      setMsg("Contact saved!")
      router.refresh()
    } catch {
      setMsg("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  function addEmail() {
    setEmailList([...emailList, { label: "", address: "" }])
  }

  function removeEmail(i: number) {
    setEmailList(emailList.filter((_, idx) => idx !== i))
  }

  function updateEmail(i: number, field: "label" | "address", val: string) {
    const next = [...emailList]
    const item = next[i]
    if (item) next[i] = { label: item.label, address: item.address, [field]: val }
    setEmailList(next)
  }

  function addLink() {
    setLinkList([...linkList, { label: "", url: "", desc: "" }])
  }

  function removeLink(i: number) {
    setLinkList(linkList.filter((_, idx) => idx !== i))
  }

  function updateLink(i: number, field: "label" | "url" | "desc", val: string) {
    const next = [...linkList]
    const item = next[i]
    if (item) next[i] = { label: item.label, url: item.url, desc: item.desc, [field]: val }
    setLinkList(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Page</h1>
        <Button onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {msg && (
        <p className={`text-sm mb-4 px-4 py-2 rounded-lg ${msg === "Contact saved!" ? "bg-emerald/10 text-emerald border border-emerald/20" : "bg-coral/10 text-coral border border-coral/20"}`}>
          {msg}
        </p>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Description */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <h2 className="text-sm font-semibold mb-3">Description</h2>
          <div className="space-y-2">
            <Label htmlFor="desc">Intro text shown on the contact page</Label>
            <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
        </div>

        {/* Emails */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Email Addresses</h2>
            <Button variant="ghost" size="sm" onClick={addEmail} className="gap-1">
              <Plus size={14} /> Add Email
            </Button>
          </div>
          <div className="space-y-3">
            {emailList.map((em, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={14} className="text-[var(--text-tertiary)] shrink-0" />
                <Input
                  placeholder="Label (e.g. Academic)"
                  value={em.label}
                  onChange={(e) => updateEmail(i, "label", e.target.value)}
                  className="w-32"
                />
                <Input
                  placeholder="email@example.com"
                  value={em.address}
                  onChange={(e) => updateEmail(i, "address", e.target.value)}
                  className="flex-1"
                />
                <button onClick={() => removeEmail(i)} className="text-[var(--danger)] hover:opacity-70">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Social Links</h2>
            <Button variant="ghost" size="sm" onClick={addLink} className="gap-1">
              <Plus size={14} /> Add Link
            </Button>
          </div>
          <div className="space-y-3">
            {linkList.map((lnk, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={14} className="text-[var(--text-tertiary)] shrink-0" />
                <Input
                  placeholder="Label"
                  value={lnk.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="URL"
                  value={lnk.url}
                  onChange={(e) => updateLink(i, "url", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Description"
                  value={lnk.desc}
                  onChange={(e) => updateLink(i, "desc", e.target.value)}
                  className="w-28"
                />
                <button onClick={() => removeLink(i)} className="text-[var(--danger)] hover:opacity-70">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <h2 className="text-sm font-semibold mb-3">Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City / Location</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

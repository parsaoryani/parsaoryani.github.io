"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function ProfilePhotoEditor({ current }: { current: { url?: string; alt?: string } | null }) {
  const router = useRouter()
  const [url, setUrl] = useState(current?.url ?? "")
  const [alt, setAlt] = useState(current?.alt ?? "Profile photo")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [preview, setPreview] = useState(current?.url ?? "")

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch("/api/photo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt }),
      })
      if (res.ok) {
        setMsg("Photo saved!")
        setPreview(url)
        router.refresh()
      } else {
        setMsg("Failed to save")
      }
    } catch {
      setMsg("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Remove profile photo?")) return
    setSaving(true)
    try {
      await fetch("/api/photo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "", alt: "Profile photo" }),
      })
      setUrl("")
      setAlt("Profile photo")
      setPreview("")
      setMsg("Photo removed")
      router.refresh()
    } catch {
      setMsg("Failed to remove")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {msg && (
        <p className="text-sm px-4 py-2 rounded-lg border"
          style={{ backgroundColor: msg.includes("Failed") ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.1)", color: msg.includes("Failed") ? "rgb(239,68,68)" : "rgb(52,211,153)", borderColor: msg.includes("Failed") ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.2)" }}>
          {msg}
        </p>
      )}

      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2 className="text-sm font-semibold mb-4">Profile Photo</h2>

        {preview ? (
          <div className="mb-4">
            <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-800/50">
              <Image src={preview} alt={alt} width={160} height={160} className="w-full h-full object-cover" />
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-center w-40 h-40 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/30 text-[var(--text-tertiary)]">
            <p className="text-xs font-mono">No photo</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="photoUrl">Image URL</Label>
            <Input id="photoUrl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoAlt">Alt Text</Label>
            <Input id="photoAlt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Photo"}</Button>
            {preview && <Button variant="danger" onClick={remove}>Remove Photo</Button>}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
        <h2 className="text-sm font-semibold mb-2">Instructions</h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Upload your photo to any image hosting service (Imgur, Cloudinary, GitHub, etc.)
          and paste the direct image URL above. The photo will appear on the public About page.
        </p>
      </div>
    </div>
  )
}

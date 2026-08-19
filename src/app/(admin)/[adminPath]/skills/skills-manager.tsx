"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit3, Trash2, X, Check, AlertCircle } from "lucide-react"

interface Skill { id: string; name: string; proficiency: string | null }
interface Category { id: string; name: string; skills: Skill[] }

export function SkillsManager({ categories: initial }: { categories: Category[] }) {
  const router = useRouter()
  const [categories] = useState(initial)
  const [newCat, setNewCat] = useState("")
  const [addingCat, setAddingCat] = useState(false)
  const [newSkills, setNewSkills] = useState<Record<string, string>>({})
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [editCatName, setEditCatName] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function addCategory() {
    if (!newCat.trim()) return
    setError(null)
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCat.trim() }),
    })
    if (!res.ok) { setError("Failed to add category"); return }
    setNewCat("")
    setAddingCat(false)
    router.refresh()
  }

  async function updateCategory(id: string) {
    if (!editCatName.trim()) return
    setError(null)
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editCatName.trim() }),
    })
    if (!res.ok) { setError("Failed to update category"); return }
    setEditingCat(null)
    router.refresh()
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category and all its skills?")) return
    setError(null)
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" })
    if (!res.ok) { setError("Failed to delete category"); return }
    router.refresh()
  }

  async function addSkill(categoryId: string) {
    const name = (newSkills[categoryId] || "").trim()
    if (!name) return
    setError(null)
    const res = await fetch("/api/skills/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, categoryId, proficiency: "advanced" }),
    })
    if (!res.ok) { setError("Failed to add skill"); return }
    setNewSkills({ ...newSkills, [categoryId]: "" })
    router.refresh()
  }

  async function deleteSkill(id: string) {
    setError(null)
    const res = await fetch(`/api/skills/items/${id}`, { method: "DELETE" })
    if (!res.ok) { setError("Failed to delete skill"); return }
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button variant="default" size="sm" className="font-mono text-xs gap-1.5" onClick={() => setAddingCat(!addingCat)}>
          <Plus size={14} /> Add Category
        </Button>
      </div>

      {addingCat && (
        <div className="flex gap-2 mb-4 max-w-md">
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Category name" />
          <Button size="sm" onClick={addCategory}><Check size={14} /></Button>
          <Button size="sm" variant="ghost" onClick={() => setAddingCat(false)}><X size={14} /></Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex items-center justify-between mb-3">
              {editingCat === cat.id ? (
                <div className="flex gap-2">
                  <Input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
                  <Button size="sm" onClick={() => updateCategory(cat.id)}><Check size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingCat(null)}><X size={14} /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-mono text-[var(--text-tertiary)] uppercase tracking-wider">{cat.name}</h2>
                  <button onClick={() => { setEditingCat(cat.id); setEditCatName(cat.name) }}>
                    <Edit3 size={12} className="text-[var(--accent)]" />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)}>
                    <Trash2 size={12} className="text-[var(--danger)]" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <div key={skill.id} className="group flex items-center gap-1">
                  <Badge variant={skill.proficiency === "expert" ? "default" : "secondary"} className="font-mono text-xs">
                    {skill.name}
                  </Badge>
                  <button onClick={() => deleteSkill(skill.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={10} className="text-[var(--danger)]" />
                  </button>
                </div>
              ))}
              <div className="flex gap-1 items-center">
                <Input
                  value={newSkills[cat.id] || ""}
                  onChange={(e) => setNewSkills({ ...newSkills, [cat.id]: e.target.value })}
                  placeholder="Add skill..."
                  className="h-7 w-32 text-xs px-2"
                  onKeyDown={(e) => e.key === "Enter" && addSkill(cat.id)}
                />
                <button onClick={() => addSkill(cat.id)}>
                  <Plus size={12} className="text-[var(--accent)]" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-[var(--text-tertiary)] font-mono">No skills configured.</p>
        )}
      </div>
    </div>
  )
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const base = "inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-medium font-mono border"
  const v = variant === "secondary"
    ? "bg-indigo/10 text-indigo border-indigo/20"
    : variant === "default"
    ? "bg-cyan/10 text-cyan border-cyan/20"
    : "bg-slate-800/50 text-mist border-transparent"
  return <span className={`${base} ${v} ${className || ""}`}>{children}</span>
}

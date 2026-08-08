"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Quote, Copy, Check } from "lucide-react"

export function BibTeXCopy({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = bibtex
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-mono text-xs gap-1.5"
      onClick={handleCopy}
      aria-label={copied ? "BibTeX copied" : "Copy BibTeX citation"}
    >
      {copied ? <Check size={14} className="text-emerald" /> : <Quote size={14} />}
      {copied ? "Copied" : "BibTeX"}
    </Button>
  )
}
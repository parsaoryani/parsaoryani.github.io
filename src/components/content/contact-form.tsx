"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema, type ContactFormData } from "@/lib/validation/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, Loader2 } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again later.")
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald/10 border border-emerald/20 mb-5">
          <CheckCircle size={28} className="text-emerald" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
        <p className="text-sm text-mist max-w-xs">
          Thank you for reaching out. I will get back to you as soon as possible.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            {...register("name")}
            className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
          />
          {errors.name && (
            <p className="text-xs text-coral">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
          />
          {errors.email && (
            <p className="text-xs text-coral">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Subject (optional)</Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          {...register("subject")}
          className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Message</Label>
        <Textarea
          id="body"
          placeholder="Your message..."
          {...register("body")}
          className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors min-h-[140px]"
        />
        {errors.body && (
          <p className="text-xs text-coral">{errors.body.message}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-coral bg-coral/5 px-4 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" disabled={isSubmitting} className="font-mono text-xs gap-2">
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={14} />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}

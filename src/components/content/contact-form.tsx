"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactFormSchema, type ContactFormData } from "@/lib/validation/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<string>("")
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  })

  function announce(message: string) {
    setAnnouncement(message)
    setTimeout(() => setAnnouncement(""), 1000)
  }

  async function onSubmit(data: ContactFormData) {
    setError(null)
    announce("Sending message...")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSubmitted(true)
      announce("Message sent successfully")
    } catch {
      const errMsg = "Something went wrong. Please try again later."
      setError(errMsg)
      announce(errMsg)
      // Focus the first invalid field on server error
      setTimeout(() => {
        const firstError = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")
        firstError?.focus()
      }, 100)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
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
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="form-announcement">
        {announcement}
      </div>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name")}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={!!errors.name}
              className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
            />
            {errors.name && (
              <p id="name-error" className="text-xs text-coral" role="alert">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-coral" role="alert">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Subject (optional)</Label>
          <Input
            id="subject"
            placeholder="What's this about?"
            {...register("subject")}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            aria-invalid={!!errors.subject}
            className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors"
          />
          {errors.subject && (
            <p id="subject-error" className="text-xs text-coral" role="alert">{errors.subject.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="body" className="text-sm text-mist font-mono text-xs uppercase tracking-wider">Message</Label>
          <Textarea
            id="body"
            placeholder="Your message..."
            {...register("body")}
            aria-describedby={errors.body ? "body-error" : undefined}
            aria-invalid={!!errors.body}
            className="bg-slate-800/50 border-slate-700/50 focus:border-cyan/50 transition-colors min-h-[140px]"
          />
          {errors.body && (
            <p id="body-error" className="text-xs text-coral" role="alert">{errors.body.message}</p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-coral bg-coral/5 px-4 py-2 rounded-lg" role="alert">
            <AlertCircle size={14} /> {error}
          </div>
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
    </>
  )
}
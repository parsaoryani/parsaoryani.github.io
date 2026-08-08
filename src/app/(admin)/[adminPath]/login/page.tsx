"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginData } from "@/lib/validation/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [requires2fa, setRequires2fa] = useState(false)
  const [sessionToken, setSessionToken] = useState("")
  const [totpToken, setTotpToken] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  async function onLogin(data: LoginData) {
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Login failed")
        return
      }
      if (json.requires2fa) {
        setRequires2fa(true)
        setSessionToken(json.sessionToken)
        return
      }
      window.location.assign(".")
    } catch {
      setError("Connection error. Try again.")
    }
  }

  async function onVerify2fa(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totpToken, sessionToken }),
      })
      if (!res.ok) {
        setError("Invalid 2FA code")
        return
      }
      window.location.assign(".")
    } catch {
      setError("Connection error.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {!requires2fa ? (
          <>
            <h1 className="text-xl font-bold mb-2">Admin Access</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Authenticate to manage content.
            </p>
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-xs text-[var(--danger)]">{errors.password.message}</p>
                )}
              </div>
              {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full font-mono text-xs">
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold mb-2">Two-Factor Authentication</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Enter the code from your authenticator app.
            </p>
            <form onSubmit={onVerify2fa} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp">Authentication Code</Label>
                <Input
                  id="totp"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="font-mono text-center text-lg tracking-widest"
                />
              </div>
              {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
              <Button type="submit" className="w-full font-mono text-xs">
                Verify
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

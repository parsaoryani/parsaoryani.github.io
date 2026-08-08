function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] || fallback
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  ADMIN_PATH: optionalEnv("ADMIN_PATH", "x7k2-console"),
  SITE_URL: optionalEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:4321"),
  SITE_DOMAIN: optionalEnv("SITE_DOMAIN", "parsaoryani.me"),
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY", ""),
} as const

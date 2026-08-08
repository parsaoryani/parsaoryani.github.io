import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://parsaoryani.me"

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // Admin routes - check session cookie exists (skip login page)
  if (
    pathname.startsWith(`/${ADMIN_PATH}`) &&
    !pathname.startsWith(`/${ADMIN_PATH}/login`)
  ) {
    const sessionToken = request.cookies.get("session_token")?.value
    if (!sessionToken) {
      const loginUrl = new URL(`/${ADMIN_PATH}/login`, request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Origin validation for cookie-authenticated mutating requests in production
  if (
    process.env.NODE_ENV === "production" &&
    MUTATING_METHODS.has(request.method) &&
    request.cookies.has("session_token")
  ) {
    const requestOrigin = request.headers.get("origin")
    if (!requestOrigin || new URL(requestOrigin).origin !== new URL(SITE_ORIGIN).origin) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
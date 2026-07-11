import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_PATH = process.env.ADMIN_PATH || "x7k2-console"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth/auth"

export async function POST(request: Request) {
  await destroySession()
  const origin = new URL(request.url).origin
  return NextResponse.redirect(new URL("/", origin))
}

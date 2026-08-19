import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { timingSafeEqual } from "crypto"

function tokensMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? ""
    const expectedToken = process.env.REVALIDATION_TOKEN

    if (!expectedToken || !tokensMatch(authHeader, `Bearer ${expectedToken}`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await request.json()

    revalidatePath("/", "layout")

    return NextResponse.json({ revalidated: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

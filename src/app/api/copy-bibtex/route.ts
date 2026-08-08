import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const bibtex = formData.get("bibtex") as string
    if (!bibtex) {
      return NextResponse.json({ error: "No BibTeX provided" }, { status: 400 })
    }
    // Return the BibTeX so the client can copy it
    return NextResponse.json({ bibtex })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getSession } from "@/lib/auth/auth"
import crypto from "crypto"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// Course materials only, excludes html/svg/js/etc. that could serve stored XSS if opened directly.
const ALLOWED_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "csv", "txt", "md",
  "zip", "png", "jpg", "jpeg", "gif", "webp", "mp4", "mov",
])

async function uploadToR2(file: File, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3")
  const client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })

  const arrayBuffer = await file.arrayBuffer()
  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(arrayBuffer),
    ContentType: file.type,
  }))

  return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`
}

async function uploadToLocal(file: File, key: string): Promise<string> {
  const fs = await import("fs/promises")
  const path = await import("path")
  // turbopackIgnore: UPLOAD_DIR is env-configurable, so static analysis cannot
  // scope these paths and traces the entire project (including public/) into the
  // serverless bundle. Opting out keeps the deployed function small.
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), UPLOAD_DIR)
  await fs.mkdir(dir, { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const filePath = path.join(/*turbopackIgnore: true*/ dir, key)
  await fs.writeFile(filePath, Buffer.from(arrayBuffer))

  return `/uploads/${key}`
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const courseId = formData.get("courseId") as string
    const kind = formData.get("kind") as string || "file"

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })

    const rawExt = file.name.split(".").pop()?.toLowerCase() || ""
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }
    const ext = rawExt
    const hash = crypto.randomBytes(16).toString("hex")
    const key = `courses/${courseId}/${hash}.${ext}`

    let url: string
    if (process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_BUCKET_NAME) {
      url = await uploadToR2(file, key)
    } else {
      url = await uploadToLocal(file, key)
    }

    const maxOrder = await prisma.courseFile.aggregate({
      where: { courseId },
      _max: { sortOrder: true },
    })

    const fileRecord = await prisma.courseFile.create({
      data: {
        courseId,
        name: file.name,
        url,
        kind,
        size: file.size,
        mimeType: file.type,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
      },
    })

    return NextResponse.json(fileRecord, { status: 201 })
  } catch (e) {
    console.error("Upload error:", e)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
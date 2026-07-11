import { Resend } from "resend"
import { writeFile, mkdir, readdir, readFile } from "fs/promises"
import { join } from "path"

const DOMAIN = process.env.SITE_DOMAIN || "parsaoryani.me"
const FROM_EMAIL = `contact@${DOMAIN}`
const TO_EMAIL = `parsa@${DOMAIN}`
const IS_DEV = !process.env.RESEND_API_KEY

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function logDevEmail(type: string, to: string, data: Record<string, unknown>) {
  const entry = { type, to, ...data, timestamp: new Date().toISOString() }
  console.log(`[mail-dev] ${type} → ${to}`)
  console.log(JSON.stringify(entry, null, 2))
  writeMailDevLog(entry)
}

async function writeMailDevLog(entry: object) {
  try {
    const dir = join(process.cwd(), ".mail-dev")
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, `${Date.now()}.json`), JSON.stringify(entry, null, 2))
  } catch (err) {
    console.warn("[mail-dev] Failed to write log:", err)
  }
}

function notificationHtml(data: { name: string; email: string; subject?: string; body: string }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#38e1c4">New Contact Message</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:8px 12px;border:1px solid #333;color:#666;font-size:13px">From</td>
            <td style="padding:8px 12px;border:1px solid #333;font-size:14px">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #333;color:#666;font-size:13px">Email</td>
            <td style="padding:8px 12px;border:1px solid #333;font-size:14px">
              <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
        <tr><td style="padding:8px 12px;border:1px solid #333;color:#666;font-size:13px">Subject</td>
            <td style="padding:8px 12px;border:1px solid #333;font-size:14px">${escapeHtml(data.subject || "(none)")}</td></tr>
      </table>
      <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;white-space:pre-wrap">${escapeHtml(data.body)}</div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">Sent from your portfolio contact form</p>
    </div>
  `
}

function confirmationHtml(name: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#38e1c4">Hi ${escapeHtml(name)},</h2>
      <p>Thank you for your message! I'll review it and get back to you as soon as possible.</p>
      <p>In the meantime, feel free to explore my work at <a href="https://${DOMAIN}">${DOMAIN}</a>.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
      <p style="color:#999;font-size:12px">Best,<br>Parsa Oryani</p>
    </div>
  `
}

const resendClient = process.env.RESEND_API_KEY && !IS_DEV
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export function sendContactNotification(data: {
  name: string
  email: string
  subject?: string
  body: string
}) {
  if (IS_DEV) {
    logDevEmail("notification", TO_EMAIL, data)
    return Promise.resolve({ id: "dev" })
  }
  return resendClient!.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `[Portfolio] ${data.subject || "New Contact Message"}`,
    html: notificationHtml(data),
  })
}

export function sendContactConfirmation(data: {
  name: string
  email: string
}) {
  if (IS_DEV) {
    logDevEmail("confirmation", data.email, data)
    return Promise.resolve({ id: "dev" })
  }
  return resendClient!.emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: "Thank you for reaching out",
    html: confirmationHtml(data.name),
  })
}

export async function getDevMailLog() {
  const dir = join(process.cwd(), ".mail-dev")
  try {
    const files = await readdir(dir)
    const entries = await Promise.all(
      files.sort().reverse().slice(0, 50).map(async (f) => {
        const content = await readFile(join(dir, f), "utf-8")
        return JSON.parse(content)
      })
    )
    return entries
  } catch {
    return []
  }
}

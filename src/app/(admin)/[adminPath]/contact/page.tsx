import { prisma } from "@/lib/db/prisma"
import { ContactEditor } from "@/components/admin/contact-editor"

export default async function AdminContactPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["contact_description", "contact_emails", "contact_links", "contact_location"] } },
  })

  const getVal = (key: string) => settings.find((s) => s.key === key)?.value ?? null

  return (
    <ContactEditor
      description={getVal("contact_description") as { text: string } | null}
      emails={getVal("contact_emails") as Array<{ label: string; address: string }> | null}
      links={getVal("contact_links") as Array<{ label: string; url: string; desc: string }> | null}
      location={getVal("contact_location") as { city: string; note: string } | null}
      settings={settings}
    />
  )
}

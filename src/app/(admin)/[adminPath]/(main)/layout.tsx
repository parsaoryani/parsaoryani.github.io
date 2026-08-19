import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { getSession } from "@/lib/auth/auth"

export default async function AdminSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ adminPath: string }>
}) {
  const { adminPath } = await params
  const session = await getSession()
  if (!session) redirect(`/${adminPath}/login`)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar adminPath={adminPath} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ adminPath: string }>
}) {
  const { adminPath } = await params

  return (
    <div className="flex min-h-screen">
      <AdminSidebar adminPath={adminPath} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}

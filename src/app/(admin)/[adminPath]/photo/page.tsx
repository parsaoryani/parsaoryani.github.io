import { prisma } from "@/lib/db/prisma"
import { ProfilePhotoEditor } from "@/components/admin/profile-photo-editor"

export default async function AdminPhotoPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "profile_photo" } })
  const photo = setting?.value as { url?: string; alt?: string } | null

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Photo</h1>
      </div>
      <ProfilePhotoEditor current={photo} />
    </div>
  )
}

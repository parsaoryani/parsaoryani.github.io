type TagLike = {
  id: string
  slug: string
  label: string
}

type ProjectWithTags<Tag extends TagLike> = {
  tags: Array<{
    tagId: string
    tag: Tag
  }>
}

export function getAvailableProjectTags<Tag extends TagLike>(
  projects: ProjectWithTags<Tag>[],
  allTags: Tag[]
) {
  const projectTagIds = new Set(
    projects.flatMap((project) => project.tags.map((projectTag) => projectTag.tagId))
  )

  return allTags.filter((tag) => projectTagIds.has(tag.id))
}

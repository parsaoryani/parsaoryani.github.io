import type { Publication, Project } from "@prisma/client"

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Parsa Oryani",
    givenName: "Parsa",
    familyName: "Oryani",
    alumniOf: "Sharif University of Technology",
    jobTitle: "M.Sc. Computer Engineering",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://parsaoryani.me",
    sameAs: [
      "https://github.com/parsaoryani",
      "https://scholar.google.com/citations?user=YOUR_ID",
      "https://www.linkedin.com/in/parsa-oryani/",
    ],
  }
}

export function scholarlyArticleSchema(pub: Publication) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    name: pub.title,
    author: (pub.authors as Array<{ name: string }>).map((a: { name: string }) => ({
      "@type": "Person",
      name: a.name,
    })),
    datePublished: pub.publishedAt.toISOString(),
    description: pub.tldr || pub.abstract,
    ...(pub.doi ? { sameAs: `https://doi.org/${pub.doi}` } : {}),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

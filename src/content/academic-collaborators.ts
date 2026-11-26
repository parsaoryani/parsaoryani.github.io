export interface AcademicCollaborator {
  name: string
  title: string
  affiliation: [string, string]
  relationship: string
  scholarUrl: string
  email: string
  photoUrl: string | null
  photoPosition?: string
  /**
   * Set to `true` to keep a profile in this file but hide it from the public
   * References section. Remove the flag (or set it to `false`) to re-publish.
   */
  hidden?: boolean
}

/**
 * Add or edit reference profiles here; the homepage layout does not need to change.
 * Store verified portraits under `public/collaborators/` and set `photoUrl` to
 * `null` when no reliable portrait is available.
 */
export const academicCollaborators: AcademicCollaborator[] = [
  {
    name: "Dr. Morteza Amini",
    title: "Associate Professor",
    affiliation: [
      "Department of Computer Engineering",
      "Sharif University of Technology, Tehran",
    ],
    relationship: "Research Supervisor — Agentic AI Security",
    scholarUrl: "https://scholar.google.com/citations?user=Rsmx5DYAAAAJ&hl=en",
    email: "amini@sharif.edu",
    photoUrl: "/collaborators/morteza-amini-scholar.jpg",
  },
  {
    name: "Dr. Amir Mahdi Sadeghzadeh",
    title: "Assistant Professor",
    affiliation: [
      "Department of Computer Engineering",
      "Sharif University of Technology, Tehran",
    ],
    relationship: "Teaching Assistant — Computer Networks",
    scholarUrl: "https://scholar.google.com/citations?user=SndfdlwAAAAJ&hl=en",
    email: "sadeghzadeh@sharif.edu",
    photoUrl: "/collaborators/amir-mahdi-sadeghzadeh-scholar.jpg",
    hidden: true,
  },
  {
    name: "Dr. Mohammad Ali",
    title: "Assistant Professor",
    affiliation: [
      "Department of Mathematics & Computer Science",
      "Amirkabir University of Technology, Tehran",
    ],
    relationship: "Instructor — Cryptography I & Special Topics in Cryptography",
    scholarUrl: "https://scholar.google.com/citations?user=0MJl8EcAAAAJ&hl=en",
    email: "mali71@aut.ac.ir",
    photoUrl: "/collaborators/mohammad-ali-scholar.jpg",
    hidden: true,
  },
  {
    name: "Prof. Mehdi Ghatee",
    title: "Full Professor",
    affiliation: [
      "Department of Mathematics & Computer Science",
      "Amirkabir University of Technology, Tehran",
    ],
    relationship: "Teaching Assistant — Artificial Intelligence & Lab",
    scholarUrl: "https://scholar.google.com/citations?user=b7lfEJwAAAAJ&hl=en",
    email: "ghatee@aut.ac.ir",
    photoUrl: "/collaborators/mehdi-ghatee-scholar.jpg",
  },
  {
    name: "Dr. Mohammad Mahdi Bejani",
    title: "Lecturer",
    affiliation: [
      "Sharif University of Technology",
      "Formerly at Amirkabir University, Tehran",
    ],
    relationship: "Teaching Assistant — Advanced Programming",
    scholarUrl: "https://scholar.google.com/citations?user=zCpmwYIAAAAJ&hl=en",
    email: "mbejani@aut.ac.ir",
    photoUrl: "/collaborators/mohammad-mahdi-bejani-scholar.jpg",
    photoPosition: "50% 40%",
  },
]

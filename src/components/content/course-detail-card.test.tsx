import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { CourseDetailCard, type CourseDetailShape } from "@/components/content/course-detail-card"

const course: CourseDetailShape = {
  id: "course-secure-software",
  name: "Secure Software Systems",
  grade: null,
  highlight: null,
  instructor: null,
  focus: null,
  topics: null,
  syllabus: null,
  exercises: null,
  projects: null,
  discussions: null,
  links: [],
  files: [
    {
      id: "file-hw1",
      name: "HW1: Memory Corruption & Exploitation",
      url: "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/HW/ce815-041-hw1.pdf",
      description: "Format string, ROP, CVE exploitation, remote pwn challenges",
    },
  ],
}

describe("CourseDetailCard", () => {
  it("groups a homework file under its HW label and links to GitHub", () => {
    render(<CourseDetailCard course={course} />)

    expect(screen.getByText("HW1")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /Memory Corruption & Exploitation/ })
    ).toHaveAttribute(
      "href",
      "https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/HW/ce815-041-hw1.pdf"
    )
    expect(screen.getByText("Format string, ROP, CVE exploitation, remote pwn challenges")).toBeInTheDocument()
  })
})

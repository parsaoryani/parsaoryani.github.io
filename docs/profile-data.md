# Profile Data

Human-readable source of truth for verified personal/academic information rendered by the site (education, relevant coursework, teaching assistant experience). This document and `scripts/seed.ts` must stay in sync — when new or corrected information arrives, update both.

**Data status:** Verified data. Current as of August 2026.

## Education

### M.Sc. in Computer Engineering
Sharif University of Technology

### B.Sc. in Computer Science
Amirkabir University of Technology (Tehran Polytechnic)

## Relevant Coursework

### M.Sc. in Computer Engineering — Sharif University of Technology

| Course | Grade |
|---|---|
| Applied Cryptography | 18.9 / 20 |
| Secure Software Systems | 18.2 / 20 |

### B.Sc. in Computer Science — Amirkabir University of Technology (Tehran Polytechnic)

| Course | Grade |
|---|---|
| Artificial Intelligence and Lab | 20 / 20 |
| Probability I | 19.46 / 20 |
| Cryptography I | 18.75 / 20 |
| Foundations of Matrices and Linear Algebra | 18.69 / 20 |
| Special Topics in Cryptography | 18.25 / 20 |
| Design and Analysis of Algorithms | 18 / 20 |
| Advanced Programming | 18 / 20 |
| Foundations of Probability | 18 / 20 |
| Numerical Linear Algebra | 17.55 / 20 |
| Foundations of Logic and Set Theory | 17.50 / 20 |

## Teaching Assistant Experience

Reverse chronological order.

### Teaching Assistant — Computer Networks
- **University:** Sharif University of Technology
- **Course level:** Undergraduate
- **Instructor:** Dr. Sadeghzadeh
- **Semester:** Spring 2026
- **Responsibilities:** Designed theoretical assignments; designed practical assignments; graded theoretical and practical assignments.
- **Website description:** "Designed and graded theoretical and practical assignments for the undergraduate Computer Networks course."

### Teaching Assistant — Machine Learning
- **University:** Sharif University of Technology
- **Course level:** Undergraduate
- **Instructor:** Dr. Motahari
- **Semester:** Spring 2026
- **Responsibilities:** Designed theoretical assignments; graded assignments.
- **Website description:** "Designed theoretical assignments and evaluated student submissions for the undergraduate Machine Learning course."

### Teaching Assistant — Artificial Intelligence and Lab
- **University:** Amirkabir University of Technology
- **Instructor:** Dr. Ghatee
- **Semester:** Spring 2025
- **Responsibilities:** Designed theoretical assignments; designed practical assignments; graded theoretical and practical assignments.
- **Website description:** "Designed and graded theoretical and practical assignments for the Artificial Intelligence and Lab course."

### Teaching Assistant — Foundations of Matrices and Linear Algebra
- **University:** Amirkabir University of Technology
- **Instructor:** Dr. Najafi
- **Semester:** Fall 2023
- **Responsibilities:** Designed assignments; designed quizzes; graded assignments and quizzes; conducted problem-solving sessions; conducted review sessions; answered students' questions during exercise/review sessions.
- **Website description:** "Designed and graded assignments and quizzes, and conducted problem-solving and review sessions."

### Teaching Assistant — Advanced Programming
- **University:** Amirkabir University of Technology
- **Instructor:** Dr. Bejani
- **Semester:** Spring 2023
- **Responsibilities:** Designed programming assignments; designed practical projects; graded assignments and projects; conducted workshops; conducted problem-solving and review sessions.
- **Website description:** "Designed and graded programming assignments and practical projects, and conducted workshops and problem-solving sessions."

## Date representation note

The `TeachingAssistant` model stores `startDate`/`endDate` (exact days), but only semester/year was provided for each entry. Semesters were mapped to date ranges using the site's existing convention (Fall → Sep 1–Jan 15, Spring → Feb 1–Jun 15) purely so the entries sort and display correctly — no specific day was verified or implied beyond "the semester named above."

## Information to complete later

These fields exist as optional/nullable elsewhere in the schema (or can be added as nullable columns later without a breaking migration) and are intentionally left blank rather than guessed:

- Instructor website / faculty page links
- Course website links
- GitHub repositories for TA'd course materials
- Assignment/project links
- Syllabus documents
- Detailed per-course descriptions beyond the concise website blurb above
- Number of students per course
- Number of assignments/workshops
- Workshop details (for Advanced Programming TA)
- Supporting evidence/verification links or certificates
- Additional notes, tags

Do not populate these with invented values — leave blank until real information is provided, then update this file and `scripts/seed.ts` together.

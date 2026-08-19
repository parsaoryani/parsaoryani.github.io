# Profile Data

Human-readable source of truth for verified personal/academic information rendered by the site (education, relevant coursework, teaching assistant experience). This document and `scripts/seed.ts` must stay in sync — when new or corrected information arrives, update both.

**Data status:** Verified data. Current as of August 2026.

## Education

### M.Sc. in Computer Engineering
**Sharif University of Technology**

* Start: September 2025
* Status: Present
* Academic period: Fall 2025 – Present
* National Master's Entrance Examination Rank: 56

### B.Sc. in Computer Science
**Amirkabir University of Technology (Tehran Polytechnic)**

* Start: September 2020
* Completion: February 2025
* Academic period: Fall 2020 – Fall 2024
* National University Entrance Examination Rank: 343

## Relevant Coursework

### M.Sc. in Computer Engineering — Sharif University of Technology

| Course | Grade |
|---|---|
| Applied Cryptography | 18.9 / 20 |
| Secure Software Systems | 18.2 / 20 |

Applied Cryptography's course project is **ZK-Mixer** (https://github.com/parsaoryani/ZK-Mixer) — linked from this course's section on `/about`. Slides for the presentation are pending (to be added via the admin panel).

### M.Sc. Spring 2026 courses — Sharif University of Technology (started ~February 2026)

| Course | Grade |
|---|---|
| Formal Methods in Information Security | *(pending)* |
| Deep Learning | *(pending)* |
| Foundations and Applications of Blockchain | *(pending)* |

Grades, instructors, topics, and syllabi for these courses are pending — add them here and in `scripts/seed.ts` (`mscCourses`) together when available.

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

### Syllabi — B.Sc. Amirkabir courses

Full syllabus text lives in `scripts/seed.ts` (`bscCourses`) and renders on `/about` behind a "View syllabus" toggle. Summary:

| Course | Highlight | Focus | Instructor |
|---|---|---|---|
| Artificial Intelligence and Lab | — | — | — |
| Probability I | — | — | — |
| Cryptography I | — | — | — |
| Foundations of Matrices and Linear Algebra | — | — | — |
| Special Topics in Cryptography | Highest Grade in Class | Lattice-Based & Post-Quantum Cryptography | — |
| Design and Analysis of Algorithms | *(no syllabus provided)* | | |
| Advanced Programming | C++ | — | — |
| Foundations of Probability | *(no syllabus provided)* | | |
| Numerical Linear Algebra | — | — | Prof. Mehdi Dehghan — Group 1 |
| Foundations of Logic and Set Theory | *(no syllabus provided)* | | |

Design and Analysis of Algorithms, Foundations of Probability, and Foundations of Logic and Set Theory currently have grade only — no syllabus content was provided for them.

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

## Projects

Reverse chronological order. Only verified projects with real repositories are listed — earlier placeholder projects (`zk-bridge-verifier`, `agentic-ai-guardrails`, `private-ml-on-chain`) were removed because their repositories do not exist.

### ZK-Mixer: Regulated Anonymous Payments
- **Repo:** https://github.com/parsaoryani/ZK-Mixer
- **Role:** Solo
- **Year:** 2026
- **Context:** Course project for **Applied Cryptography** (M.Sc., Sharif University of Technology) — linked from that course's section on `/about`
- **Summary:** "Zerocash POUR-protocol implementation with regulatory-compliant disclosure — unlinkable deposits and withdrawals with tiered auditor access."
- **Tech stack:** Python, FastAPI, zk-SNARK (Bulletproof-style), Merkle tree, SQLAlchemy, SQLite, JWT, JavaScript
- **Highlights:**
  - Full Zerocash POUR protocol: 32-level Merkle tree, commitment/nullifier scheme, double-spend prevention
  - Morales et al. reversible unlinkability with three privacy tiers (HIGH/MEDIUM/LOW) for conditional auditor disclosure
  - 253 tests passing (unit, integration, API, property-based, performance) at 70% coverage, 0 mypy errors
  - Deposits/withdrawals under 500ms; Merkle ops ~5ms average; DB throughput 10-18x above targets
  - 18 threat vectors analyzed in THREAT_MODEL.md; IEEE-style research paper in docs/RESEARCH_PAPER.md
- **Planned follow-ups:** PostgreSQL migration for production; raise `schnorr.py` (58%) and `auth_routes.py` (54%) coverage

### Ethereum CLI (Sepolia Testnet)
- **Repo:** https://github.com/parsaoryani/ethereum-cli
- **Role:** Solo
- **Year:** 2025
- **Summary:** "A modular command-line interface for the Ethereum Sepolia testnet — encrypted wallet management, balance queries, ETH transfers, and transaction history export."
- **Tech stack:** Python, JSON-RPC (direct, no web3.py), Etherscan API, eth-account, cryptography, argparse, unittest
- **Highlights:**
  - Direct JSON-RPC calls to any standard endpoint (Infura, Alchemy, GetBlock) keep dependencies minimal
  - Encrypted wallet storage; private keys never stored in plaintext and all sensitive operations require a password
  - Full wallet lifecycle, balances in ETH/Wei, signed ETH transfers, tx status/history, JSON export
  - 74% overall test coverage (transaction module at 86%, its tests at 99%)
- **Planned follow-ups:** raise `wallet.py` (38%) and `rpc_client.py` (59%) coverage past 80%; add ERC-20 transfers and smart-contract interactions

## Date representation note

The `TeachingAssistant` model stores `startDate`/`endDate` (exact days), but only semester/year was provided for each entry. Semesters were mapped to date ranges using the site's existing convention (Fall → Sep 1–Jan 15, Spring → Feb 1–Jun 15) purely so the entries sort and display correctly — no specific day was verified or implied beyond "the semester named above."

## Information to complete later

These fields exist as optional/nullable elsewhere in the schema (or can be added as nullable columns later without a breaking migration) and are intentionally left blank rather than guessed:

- Instructor website / faculty page links
- Course website links
- GitHub repositories for TA'd course materials
- Assignment/project links
- Syllabus content for Design and Analysis of Algorithms, Foundations of Probability, and Foundations of Logic and Set Theory
- Detailed per-course descriptions beyond the concise website blurb above
- Number of students per course
- Number of assignments/workshops
- Workshop details (for Advanced Programming TA)
- Supporting evidence/verification links or certificates
- Additional notes, tags

Do not populate these with invented values — leave blank until real information is provided, then update this file and `scripts/seed.ts` together.

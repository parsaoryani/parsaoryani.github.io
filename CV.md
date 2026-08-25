# Parsa Oryani

**M.Sc. Computer Engineering, Sharif University of Technology**
**Research focus:** Security and scalability of decentralized systems
**Location:** Tehran, Iran
**Email:** parsa.oryani82@sharif.edu
**Website:** https://parsaoryani.github.io/
**GitHub:** https://github.com/parsaoryani
**LinkedIn:** https://www.linkedin.com/in/parsa-oryani/

---

## Research Interests

- **Secure and Scalable Cross-Chain and Layer-2 Interoperability**: Security, scalability, atomicity, and verification challenges in cross-chain and cross-rollup protocols.
- **Ethereum Mempool Security and Asymmetric DoS**: Denial-of-service attacks against Ethereum transaction pools through controlled and reproducible experiments.
- **Applied Cryptography and Zero-Knowledge Protocols**: Privacy-preserving protocols, commitment/nullifier systems, Merkle trees, and zk-SNARK-based applications.
- **Formal and Security Analysis**: Security models, trust assumptions, protocol properties, and formal reasoning for secure systems.

---

## Education

### M.Sc. in Computer Engineering

**Sharif University of Technology**, Tehran, Iran
**Sep 2025 - Present**
National Master's Entrance Examination Rank: **56**

Highlights:

- Research focus on blockchain security and AI safety.
- Graduate coursework in advanced cryptography, ML theory, and formal methods.

Selected coursework:

| Course | Grade | Instructor | Focus |
|---|---:|---|---|
| Applied Cryptography | 18.9 / 20 | Dr. Masoumeh Koochak Shooshtari | Formal security definitions, reduction-based proofs, and practical protocol design across classical and modern cryptography |
| Secure Software Systems | 18.2 / 20 | Dr. Mehdi Kharrazi | Software security theory with practical exploitation, static/dynamic analysis, automated testing, and AI-assisted vulnerability detection |
| Formal Methods in Information Security | - | Dr. Morteza Amini | Formal modeling of security policies and verification of secure systems using logical and structural reasoning |
| Deep Learning | - | Dr. Soleymani | Model development, evaluation, and analysis across classical neural networks, transformers, generative models, and foundation-model style training |
| Foundations and Applications of Blockchain | - | Dr. Amir Mahdi Sadeghzadeh | Distributed systems and cryptographic ideas applied to blockchain protocols, consensus design, scalability, and application-level analysis |

### B.Sc. in Computer Science

**Amirkabir University of Technology (Tehran Polytechnic)**, Tehran, Iran
**Sep 2020 - Feb 2025**
National University Entrance Examination Rank: **343**

Selected coursework:

| Course | Grade | Instructor | Notes |
|---|---:|---|---|
| Artificial Intelligence and Lab | 20/20 | Dr. Ghatee | Intelligent agents, search, CSPs, probabilistic inference, ML, neural networks, CNNs, and RNNs |
| Probability I | 19.46/20 | Dr. Asili | Probability spaces, Bayes' theorem, random variables, distributions, expectation, variance, joint distributions, LLN, and CLT |
| Cryptography I | 18.75/20 | Dr. Ali | Perfect secrecy, PRGs, PRFs, block ciphers, MACs, hash functions, RSA, public-key cryptography, signatures, and post-quantum introduction |
| Foundations of Matrices and Linear Algebra | 18.69/20 | Dr. Najafi | Vector spaces, linear transformations, eigenvalues/eigenvectors, diagonalization, inner-product spaces, and ML applications |
| Special Topics in Cryptography | 18.25/20 | Dr. Ali | Lattice-based and post-quantum cryptography; highest grade in class |
| Design and Analysis of Algorithms | 18/20 | Dr. Shirali-Shahreza | Algorithms coursework |
| Advanced Programming | 18/20 | Dr. Asgaripour | C++, object-oriented programming, templates, STL, data structures, file I/O |
| Foundations of Probability | 18/20 | Dr. Gorji | Probability coursework |
| Numerical Linear Algebra | 17.55/20 | Dr. Dehghan | Numerical stability, matrix factorizations, least squares, iterative methods, eigenvalues, SVD, and condition numbers |
| Foundations of Logic and Set Theory | 17.50/20 | Dr. Roshandel Tavana | Logic and set theory coursework |

---

## Research Experience

### Research Assistant: Blockchain Security

**Sharif University of Technology**
**Sep 2025 - Present**
Supervisor: [Dr. Morteza Amini](https://scholar.google.com/citations?user=Rsmx5DYAAAAJ&hl=en)
Collaborator: working closely with Ph.D. researcher Amirmohammad Aghapour

Conducting research on the security and scalability of blockchain and decentralized systems, with a focus on protocol-level security, interoperability, and emerging challenges in blockchain infrastructure.

- Studying security and scalability challenges in blockchain and decentralized protocols.
- Investigating cross-chain and Layer-2 systems, including interoperability, state verification, and cross-rollup communication.
- Analyzing protocol-level security assumptions, trust models, and potential attack surfaces.
- Conducting technical literature reviews and evaluating recent research in blockchain security and scalability.
- Supporting experimental and implementation-oriented research on blockchain infrastructure and security.

---

## Teaching Experience

### Teaching Assistant, Computer Networks

**Sharif University of Technology**
Professor: Dr. Sadeghzadeh
**Feb 2026 - Jun 2026**

- Designed theoretical assignments.
- Designed practical assignments.
- Graded theoretical and practical assignments.

### Teaching Assistant, Machine Learning

**Sharif University of Technology**
Professor: Dr. Motahari
**Feb 2026 - Jun 2026**

- Designed theoretical assignments.
- Graded assignments.

### Teaching Assistant, Artificial Intelligence and Lab

**Amirkabir University of Technology**
Professor: Dr. Ghatee
**Feb 2025 - Jun 2025**

- Designed theoretical assignments.
- Designed practical assignments.
- Graded theoretical and practical assignments.

### Teaching Assistant, Foundations of Matrices and Linear Algebra

**Amirkabir University of Technology**
Professor: Dr. Najafi
**Sep 2023 - Jan 2024**

- Designed assignments and quizzes.
- Graded assignments and quizzes.
- Conducted problem-solving and review sessions.
- Answered students' questions during exercise/review sessions.

### Teaching Assistant, Advanced Programming

**Amirkabir University of Technology**
Professor: Dr. Bejani
**Feb 2023 - Jun 2023**

- Designed programming assignments and practical projects.
- Graded assignments and projects.
- Conducted workshops, problem-solving sessions, and review sessions.

---

## Selected Projects

### ZK-Mixer: Regulated Anonymous Payments

**Solo project, 2026**
Repository: https://github.com/parsaoryani/ZK-Mixer

Zerocash POUR-protocol implementation with regulatory-compliant disclosure: unlinkable deposits and withdrawals with tiered auditor access.

- Implemented a full Zerocash-style mixer with a conditional-disclosure layer for authorized auditors.
- Built a 32-level Merkle tree, commitment/nullifier scheme, and Bulletproof-style zk-SNARK proofs.
- Added three privacy tiers: HIGH, MEDIUM, and LOW, allowing users to selectively enable regulatory oversight.
- Structured the system as a modular Python monolith with FastAPI routes, JWT authentication, SQLAlchemy/SQLite storage, and a JavaScript frontend.
- Results recorded in the project data: 253 tests passing, 70% coverage, 0 mypy errors, deposits/withdrawals under 500ms, Merkle operations around 5ms, and database throughput exceeding targets by 10-18x.

Technologies: Python, FastAPI, zk-SNARK, Merkle Tree, SQLAlchemy, SQLite, JWT, JavaScript.

### Ethereum CLI (Sepolia Testnet)

**Solo project, 2025**
Repository: https://github.com/parsaoryani/ethereum-cli

Modular command-line interface for Ethereum Sepolia: encrypted wallet management, balance queries, ETH transfers, and transaction history export.

- Built direct JSON-RPC support for standard endpoints such as Infura, Alchemy, and GetBlock.
- Used the Etherscan API for transaction-history retrieval.
- Stored wallets encrypted on disk and gated sensitive operations behind a user password.
- Implemented wallet management, RPC client, transaction construction/signing/sending, status lookup, history, and JSON export modules.
- Results recorded in the project data: full wallet lifecycle, ETH/Wei balances, signed transfers, transaction status/history, JSON export, and 74% overall test coverage.

Technologies: Python, JSON-RPC, Etherscan API, eth-account, cryptography, argparse, unittest.

### BRCC: Besu Research Control Center

**Solo project, 2025**
Repository: https://github.com/parsaoryani/brcc-lab

Local control plane for reproducible mempool/DoS experiments on a four-validator Hyperledger Besu QBFT network.

- Built around the workflow: Build -> Verify -> Observe -> Baseline -> Stress -> Compare -> Reproduce.
- Added configuration draft/diff/impact/apply flow with impact levels from NO_RESTART to CHAIN_RESET and NETWORK_REGENERATE.
- Implemented a FastAPI backend controlling Docker Compose, four Besu QBFT validator containers, Prometheus metrics, and PostgreSQL run/config metadata.
- Built a React + TypeScript + Vite frontend over REST/WebSocket APIs.
- Completed Overview, Topology, Nodes, Mempool, Consensus, Experiments, Compare, Config, and Logs pages, plus one steady-rate baseline workload.

Technologies: Python, FastAPI, React, TypeScript, Vite, PostgreSQL, Prometheus, Grafana, Docker Compose, Hyperledger Besu, QBFT.

---

## Graduate Coursework Projects and Assignments

### Applied Cryptography: ZK-Mixer

Zero-knowledge mixer implementation demonstrating advanced cryptographic protocol design.

### Secure Software Systems: Agentic Vulnerability Detection

Project report: https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/ce815-041-project.pdf

Iterative LLM agent with CodeQL integration, SARIF parsing, confidence scoring, tools for regex/grep extraction, dangerous pattern detection, and caller identification. The project analyzed nginx (10K+ LOC) and produced a 10-page report on architecture, execution traces, comparative analysis, and findings.

Assignments:

- HW1: Memory corruption and exploitation, including format string, ROP, CVE analysis, and remote pwn challenges.
- HW2: Fuzzing with Atheris and static analysis using AST and Z3.
- HW3: LLM-based vulnerability detection, context strategies, a three-stage pipeline, patch generation, and model comparison.

### Formal Methods in Information Security: Formal Verification of ZK-Rollup Security Mechanisms

Applied formal methods to verify security properties of ZK-Rollup protocols.

Assignments:

- HW1: Access control models and policy specification.
- HW2: Logic-based reasoning and information-flow control.
- HW3: Formal protocol verification.

### Deep Learning: Multi-Part Practical Assignments

Five homework sets with three parts each:

- HW1: PyTorch basics, NumPy neural networks from scratch, and optimization.
- HW2: CNNs, vision, RNNs, and LSTMs.
- HW3: Transformers, LLM inference, and state-space models.
- HW4: VAEs, GANs, and diffusion models.
- HW5: Self-supervised learning, CLIP, DALL-E, GNNs, and interpretability.

### Foundations and Applications of Blockchain

Projects:

- opML: Optimistic Machine Learning on Blockchain, optimistic execution of ML inference on-chain with fraud proofs.
- ZKsync Protocol: analysis and implementation of a ZK-Rollup scaling solution with zero-knowledge proofs.

Assignments:

- HW1: Blockchain foundations, mempool, Merkle trees, P2P networks, mining, and Bitcoin Script.
- HW2: Consensus, selfish mining, protocol divergence, difficulty, mempool, safety/liveness, and simulator work.
- HW3: Network efficiency, smart contracts, propagation, reentrancy, and NFT sale contract security.

Coursework artifacts are available at:
https://github.com/parsaoryani/courses/tree/main/masters/

---

## Technical Skills

### Decentralized Systems

- Blockchain: advanced
- Ethereum: advanced
- Solana: advanced
- Layer 2: advanced
- Cross-Chain Protocols: advanced
- DeFi: advanced

### Security and Cryptography

- Applied Cryptography: advanced
- Zero-Knowledge Proofs: advanced
- Protocol Security: advanced
- Smart Contract Security: advanced
- Formal Methods: advanced

### Distributed Systems

- Consensus: advanced
- Blockchain Scalability: advanced
- Interoperability: advanced
- Transaction Processing: advanced
- System Evaluation: advanced

### Programming and Tools

- Python: advanced
- Rust: advanced
- Solidity: advanced
- TypeScript: advanced
- Docker: advanced
- Git: advanced

### Additional Interests

- Machine Learning: proficient
- Adversarial ML: proficient
- Reinforcement Learning: proficient

---

## Publications

No published publications are currently listed in the public site data.

---

*Last updated: August 2026*

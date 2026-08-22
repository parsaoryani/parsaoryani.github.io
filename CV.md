# Parsa Oryani — Curriculum Vitae

**Research Focus:** Security and Scalability for Decentralized Systems  
**Location:** Tehran, Iran  
**Email:** parsa.oryani@gmail.com  
**GitHub:** https://github.com/parsaoryani  
**Website:** parsaoryani.github.io  

---

## Research Interests

- **Secure and Scalable Cross-Chain & Layer-2 Interoperability** — Exploring security, scalability, atomicity, and verification challenges in cross-chain and cross-rollup protocols.
- **Ethereum Mempool Security and Asymmetric DoS** — Investigating denial-of-service attacks against Ethereum transaction pools through controlled and reproducible experiments.
- **Zero-Knowledge Proofs & Privacy-Preserving Protocols** — Applied cryptography, ZK-SNARKs, regulated anonymous payments.
- **Formal Methods for Security** — Formal verification of blockchain protocols, smart contract security, access control models.
- **AI-Assisted Software Security** — LLM-based vulnerability detection, automated program analysis, agentic security auditing.

---

## Education

### M.Sc. in Computer Engineering
**Sharif University of Technology** | Tehran, Iran  
**Sep 2025 – Present** | National Master's Entrance Exam Rank: **56**

**Graduate Coursework:**

| Course | Grade | Instructor | Key Topics |
|--------|-------|------------|------------|
| **Applied Cryptography** | 18.9 / 20 | Dr. Masoumeh Koochak Shooshtari | Perfect secrecy, PRGs/PRFs/PRPs, CPA/CCA security, block ciphers (AES, differential cryptanalysis), MACs, authenticated encryption, hash functions, RSA, Diffie-Hellman, elliptic curves, digital signatures, PKI, post-quantum cryptography (lattices, LWE, NTRU) |
| **Secure Software Systems** | 18.2 / 20 | Dr. Mehdi Kharrazi | Memory corruption & exploitation, control-flow hijacking/ROP, CFI, taint analysis, symbolic/concolic execution, fuzzing, ML-based vulnerability detection, code property graphs, LLMs for security analysis, automated patch generation |
| **Formal Methods in Information Security** | — | Dr. Morteza Amini | Access control models (DAC, MAC, RBAC), Bell-LaPadula, Harrison-Ruzzo-Ullman, lattice-based information flow, classical & modal logic, noninterference, model checking, theorem proving, security protocol verification (BAN logic, epistemic logic) |
| **Deep Learning** | — | Dr. Soleymani | MLPs, backpropagation, optimization & generalization, CNNs, RNNs/LSTMs, attention & transformers, LLMs, state-space models, VAEs, GANs, diffusion models, self-supervised learning, CLIP, DALL-E, GNNs, interpretability |
| **Foundations and Applications of Blockchain** | — | Dr. Amir Mahdi Sadeghzadeh | Cryptographic primitives, Merkle trees, Nakamoto consensus, P2P networks, Bitcoin Script, safety/liveness, sharding, proof of stake, EVM/Solidity, payment channels, rollups, ZK data privacy |

---

### B.Sc. in Computer Science
**Amirkabir University of Technology (Tehran Polytechnic)** | Tehran, Iran  
**Sep 2020 – Feb 2025** | National University Entrance Exam Rank: **343**

**Relevant Coursework:**

| Course | Grade | Highlights |
|--------|-------|------------|
| **Special Topics in Cryptography** (Lattice-Based & Post-Quantum) | 18.25 / 20 | **Highest Grade in Class** — Lattices, SIS, LWE, Ring-LWE, NTRU, lattice trapdoors, signatures, FHE, attribute-based encryption |
| **Artificial Intelligence and Lab** | 20 / 20 | Intelligent agents, search, adversarial search, CSPs, probabilistic inference, supervised/unsupervised learning, neural networks, CNNs, RNNs |
| **Probability I** | 19.46 / 20 | Probability spaces, Bayes, random variables, distributions, expectation/variance, LLN, CLT |
| **Cryptography I** | 18.75 / 20 | Perfect secrecy, PRGs, PRFs, block ciphers, MACs, hash functions, RSA, public-key crypto, digital signatures, post-quantum intro |
| **Foundations of Matrices and Linear Algebra** | 18.69 / 20 | Vector spaces, linear transformations, eigenvalues/eigenvectors, diagonalization, inner-product spaces, ML applications |
| **Design and Analysis of Algorithms** | 18 / 20 | — |
| **Advanced Programming** (C++) | 18 / 20 | OOP, templates, STL, data structures, design patterns |
| **Foundations of Probability** | 18 / 20 | — |
| **Numerical Linear Algebra** | 17.55 / 20 | LU/Cholesky/QR, least squares, iterative methods, SVD, condition numbers |
| **Foundations of Logic and Set Theory** | 17.50 / 20 | — |

---

## Research Projects

### ZK-Mixer: Regulated Anonymous Payments (2026)
**Solo Project** | [GitHub](https://github.com/parsaoryani/ZK-Mixer)

Full Zerocash POUR-protocol implementation with regulatory-compliant disclosure — unlinkable deposits and withdrawals with tiered auditor access.

- **Architecture:** Modular Python monolith (`src/zkm/`) — core mixer, zk-SNARK proofs, 32-level Merkle tree, commitment/nullifier scheme, reversible unlinkability (3 privacy tiers: HIGH/MEDIUM/LOW), FastAPI REST API with JWT auth, SQLAlchemy/SQLite storage
- **Cryptography:** Bulletproof-style zk-SNARKs, Schnorr signatures, Pedersen commitments
- **Results:** 253 tests passing (147 unit, 25 integration, 24 API, 14 property-based, 8 performance) at 70% coverage, 0 mypy errors; deposits/withdrawals < 500ms; Merkle ops ~5ms; DB throughput 10-18× targets
- **Tech Stack:** Python, FastAPI, zk-SNARK, Merkle Tree, SQLAlchemy, SQLite, JWT, JavaScript

---

### BRCC: Besu Research Control Center (2025)
**Solo Project** | [GitHub](https://github.com/parsaoryani/brcc-lab)

Local control plane for reproducible mempool/DoS experiments on a 4-validator Hyperledger Besu QBFT network.

- **Approach:** Enforced safety-gated workflow: Build → Verify → Observe → Baseline → Stress → Compare → Reproduce. Configuration changes via draft/diff/impact/apply with classified impact levels (NO_RESTART → CHAIN_RESET → NETWORK_REGENERATE).
- **Architecture:** FastAPI backend + React/TypeScript/Vite frontend; Docker Compose manages 4 Besu validators; Prometheus + PostgreSQL for metrics/metadata; validator keys separate from chain data.
- **Features:** Overview, Topology, Nodes, Mempool, Consensus, Experiments, Compare, Config, Logs pages; steady-rate baseline workload; full reproducibility metadata (Besu image, chain ID, genesis hash, git commit, network generation, txpool type).
- **Tech Stack:** Python, FastAPI, React, TypeScript, Vite, PostgreSQL, Prometheus, Grafana, Docker Compose, Hyperledger Besu, QBFT

---

### Ethereum CLI (Sepolia Testnet) (2025)
**Solo Project** | [GitHub](https://github.com/parsaoryani/ethereum-cli)

Modular CLI for Ethereum Sepolia — encrypted wallet management, balance queries, ETH transfers, transaction history export.

- **Approach:** Direct JSON-RPC calls (Infura/Alchemy/GetBlock) instead of web3.py; Etherscan API for history; wallets encrypted on disk with password-gated operations.
- **Architecture:** Four modules — `wallet.py` (encrypted storage via `cryptography`), `rpc_client.py` (retry logic, checksum validation), `transaction.py` (build/sign/send, status/history/JSON export), `main.py` (argparse CLI).
- **Results:** Full wallet lifecycle, ETH/Wei balances, signed transfers, transaction status/history/JSON export; 74% test coverage (transaction.py 86%).
- **Tech Stack:** Python, JSON-RPC, Etherscan API, eth-account, cryptography, argparse, unittest

---

## Graduate Course Projects & Assignments

### Secure Software Systems — Agentic Vulnerability Detection
**Final Project** | [Report](https://github.com/parsaoryani/courses/blob/main/masters/secure-software-systems/ce815-041-project.pdf)

Iterative LLM agent with CodeQL integration, SARIF parsing, confidence scoring, tools for regex/grep extraction, dangerous pattern detection, caller identification; analyzed nginx (10K+ LOC); 10-page report on architecture, execution traces, comparative analysis, real-world findings.

**Homework:**
- **HW1:** Memory corruption & exploitation (format string, ROP, CVE analysis, remote pwn)
- **HW2:** Fuzzing (Atheris) + static analysis (AST + Z3)
- **HW3:** LLM-based vulnerability detection (context strategies, 3-stage pipeline, patch generation, model comparison)

---

### Formal Methods in Information Security — Formal Verification of ZK-Rollup Security Mechanisms
**Final Project**

Applied formal methods to verify security properties of ZK-Rollup protocols.

**Homework (English & Persian):**
- **HW1:** Access control models & policy specification
- **HW2:** Logic-based reasoning & information flow control
- **HW3:** Formal protocol verification & analysis

---

### Deep Learning — Multi-Part Practical Assignments (5 HWs × 3 parts each)

| HW | Parts | Topics |
|----|-------|--------|
| **HW1** | P1: PyTorch Basics; P2: NN from Scratch (NumPy); P3: Optimization Methods | Tensor ops, affine/ReLU/sigmoid forward-backward, FullyConnectedNet, Solver, gradient checking, GD/Momentum/RMSProp/Adam/second-order |
| **HW2** | P1: Emoji Classification; P2: CAPTCHA Segmentation; P3: RNN Implementation | CNN for vision, custom LSTM/RNN |
| **HW3** | P1: Transformer/Attention; P2: LLM Inference (CoT, self-consistency, few-shot, self-refinement); P3: State-space models | — |
| **HW4** | P1: VAE/GAN exercises; P2: Diffusion Models; P3: Advanced Generative | — |
| **HW5** | P1: Self-Supervised/Contrastive; P2: CLIP/Multimodal; P3: DALL-E/GNNs/Interpretability | — |

---

### Foundations and Applications of Blockchain — Projects

- **opML:** Optimistic Machine Learning on Blockchain — Optimistic execution of ML inference on-chain with fraud proofs
- **ZKsync Protocol:** Analysis and implementation of ZK-Rollup scaling solution with zero-knowledge proofs

**Homework (English & Persian):**
- **HW1:** Blockchain foundations (mempool, Merkle trees, P2P, mining, Bitcoin Script)
- **HW2:** Consensus & selfish mining (protocol divergence, difficulty, mempool, safety/liveness, simulator)
- **HW3:** Network efficiency & smart contracts (propagation, reentrancy, NFT sale contract security)

---

## Technical Skills

### Decentralized Systems
| Skill | Proficiency |
|-------|-------------|
| Blockchain | Advanced |
| Ethereum | Advanced |
| Solana | Advanced |
| Layer 2 (Rollups, Payment Channels) | Advanced |
| Cross-Chain Protocols | Advanced |
| DeFi | Advanced |

### Security & Cryptography
| Skill | Proficiency |
|-------|-------------|
| Applied Cryptography | Advanced |
| Zero-Knowledge Proofs (zk-SNARKs, Bulletproofs) | Advanced |
| Protocol Security | Advanced |
| Smart Contract Security | Advanced |
| Formal Methods (Model Checking, Theorem Proving) | Advanced |

### Distributed Systems
| Skill | Proficiency |
|-------|-------------|
| Consensus (QBFT, Nakamoto, PoS) | Advanced |
| Blockchain Scalability (Sharding, L2, Rollups) | Advanced |
| Interoperability | Advanced |
| Transaction Processing / Mempool | Advanced |
| System Evaluation & Benchmarking | Advanced |

### Programming & Tools
| Skill | Proficiency |
|-------|-------------|
| Python | Advanced |
| Rust | Advanced |
| Solidity | Advanced |
| TypeScript / JavaScript | Advanced |
| Docker / Docker Compose | Advanced |
| Git | Advanced |
| C++ | Proficient |

---

## Academic Highlights & Achievements

- **National Master's Entrance Exam Rank: 56** (top ~0.1% nationwide)
- **National University Entrance Exam Rank: 343**
- **Highest Grade in Class:** Special Topics in Cryptography (Lattice-Based & Post-Quantum) — 18.25/20
- **Perfect Score:** Artificial Intelligence and Lab — 20/20
- **Strong Mathematical Foundation:** Probability (19.46/20), Linear Algebra (18.69/20), Numerical Linear Algebra (17.55/20)

---

## Selected Coursework Artifacts (Available on GitHub)

All homework, projects, and notebooks are publicly available at:
**https://github.com/parsaoryani/courses/tree/main/masters/**

| Course | Directory | Format |
|--------|-----------|--------|
| Applied Cryptography | `/masters/applied-cryptography/` | PDF syllabus, slides |
| Secure Software Systems | `/masters/secure-software-systems/HW/` | PDF reports (HW1-3, Project) |
| Formal Methods in Information Security | `/masters/formal-methods-in-information-security/HW/` | PDF reports (HW1-3, Eng+Per) |
| Deep Learning | `/masters/deep-learning/HW/` | Jupyter notebooks (15 parts) |
| Foundations and Applications of Blockchain | `/masters/foundations-and-applications-of-blockchain/HW/` | PDF reports (HW1-3, Eng+Per) |

---

## Publications & Writing

*Currently preparing manuscripts for submission. Research focuses on cross-chain security, mempool DoS, and ZK-regulated privacy.*

---

## Teaching & Service

- **Teaching Assistant** — Courses at Sharif University (details available upon request)
- **Code Review & Open Source** — Active contributor to security tooling and blockchain infrastructure

---

## Languages

- **Persian:** Native
- **English:** Fluent (technical reading/writing, presentations)

---

## References

Available upon request.

---

*Last updated: August 2025*  
*Generated from academic records and project portfolio at parsaoryani.github.io*
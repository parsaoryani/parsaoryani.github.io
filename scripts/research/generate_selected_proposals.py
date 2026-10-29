#!/usr/bin/env python3
"""Generate the public, professor-neutral research proposal PDFs."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "public" / "research" / "proposals"

INK = colors.HexColor("#172033")
MUTED = colors.HexColor("#5E687A")
ACCENT = colors.HexColor("#2F6FED")
ACCENT_SOFT = colors.HexColor("#EAF0FF")
LINE = colors.HexColor("#D9E0EC")
PAPER = colors.HexColor("#FFFFFF")


@dataclass(frozen=True)
class Section:
    heading: str
    paragraphs: tuple[str, ...]


@dataclass(frozen=True)
class Proposal:
    filename: str
    title: str
    short_title: str
    subtitle: str
    tags: tuple[str, ...]
    pages: tuple[tuple[Section, ...], ...]


def bullet(label: str, body: str) -> str:
    return f"<b>{label}</b> {body}"


PROPOSALS: tuple[Proposal, ...] = (
    Proposal(
        filename="causal-policy-repair-v1.0.pdf",
        title="Causal Diagnosis and Minimal Repair of Agent Security Policies",
        short_title="Causal Policy Repair",
        subtitle="From counterfactual policy failures to executable, regression-aware repairs",
        tags=("Agent Security", "Access Control", "Program Repair", "Causal Diagnosis"),
        pages=(
            (
                Section(
                    "Research thesis",
                    (
                        "Tool-using agents rely on policies that decide whether an action should be allowed, denied, or escalated for approval. A faulty rule can admit an unsafe action, but a broad correction can also block legitimate work. This proposal asks when counterfactual evidence about the rules that changed a decision can be converted into one executable policy repair that satisfies all known safety and utility requirements.",
                        "The core hypothesis is deliberately comparative: causal diagnosis may help a bounded repair engine search more effectively, but it is not assumed to outperform direct symbolic synthesis. The research contribution is to characterize when local intervention witnesses are jointly realizable as a valid repair and to measure when that guidance is worth its cost.",
                    ),
                ),
                Section(
                    "Problem and scope",
                    (
                        "The initial setting contains one tool-using agent, one mediated outbound-action boundary, and a specificity-ordered policy with allow, deny, and ask outcomes. A request context records the tool action, provenance, trusted attributes, user authority, policy version, and active approval exceptions. Raw evidence and approval records are immutable during repair; only a bounded set of ordinary policy rules may be edited.",
                        "A repair must satisfy independently reviewed must-deny and must-allow cases, preserve ask behavior where required, and minimize unnecessary changes to permissions and policy structure. Snapshot replay is used to evaluate policy semantics under fixed evidence; later full-agent runs test whether a selected repair remains useful after the agent replans.",
                    ),
                ),
                Section(
                    "Closest-work positioning",
                    (
                        "Quantitative policy repair and Restricter already formulate least-change access-control repair and tightening as constrained optimization.[1][2] DirectFix shows that localization and synthesis can be integrated through MaxSMT rather than separated into stages.[3] AgentSpec demonstrates practical runtime enforcement for LLM agents.[4] Therefore, the intended novelty is not another policy language or another repair solver. It is the diagnosis-to-edit relationship for ordered agent policies, including shadowing, interacting rules, missing-rule cases, provenance-aware predicates, and explicit regression constraints.",
                    ),
                ),
            ),
            (
                Section(
                    "Research questions",
                    (
                        bullet("RQ1.", "Under equal total budgets, when does intervention-guided search improve qualified repair rate, anytime quality, or time to a target repair compared with direct and structural baselines?"),
                        bullet("RQ2.", "When do individually successful rule interventions fail to admit a single jointly valid repair because of ordering, shadowing, omissions, grammar limits, or conflicting requirements?"),
                        bullet("RQ3.", "How often do snapshot-valid repairs remain effective when the agent replans, chooses an alternative tool sequence, or encounters a held-out benign or adversarial task?"),
                    ),
                ),
                Section(
                    "Method",
                    (
                        bullet("1. Executable policy model.", "Implement a deterministic interpreter for the declared policy subset. It evaluates every rule condition, applies explicit priority and first-match semantics, and returns allow, deny, or ask. Tiny instances are checked exhaustively."),
                        bullet("2. Bounded repair grammar.", "Permit rule insertion, deletion, and condition edits over a typed Boolean grammar with fixed depth and patch-size limits. A MaxSMT objective first satisfies hard requirements, then minimizes legitimate-use loss, permission drift, and canonical syntax change."),
                        bullet("3. Counterfactual diagnosis.", "Override one or two rule-eligibility decisions while holding raw evidence fixed. Record minimal intervention sets that change the target decision. These are model-relative influences, not claims about historical causality."),
                        bullet("4. Realizability and fallback.", "Test whether one permitted patch confined to a diagnosed scope satisfies every hard requirement. Expand the scope when needed and retain a full-space direct solver as the correctness-preserving fallback. All diagnosis, feasibility, synthesis, and validation work is charged to the same budget."),
                        bullet("5. Independent validation.", "Execute candidate patches in a second interpreter, evaluate hidden requirements, and rerun selected agent tasks. A timeout returns a validated incumbent with minimality unresolved; only complete bounded solving can certify optimality or infeasibility."),
                    ),
                ),
                Section(
                    "Expected technical artifact",
                    (
                        "The prototype will expose a small policy language, deterministic replay harness, intervention analyzer, direct and guided synthesis modes, and a machine-readable repair receipt containing the changed rules, satisfied requirements, permission impact, and unresolved assumptions.",
                    ),
                ),
            ),
            (
                Section(
                    "Evaluation plan",
                    (
                        "The study begins with semantic fixtures for shadowing, precedence, interacting rules, missing rules, ask preservation, inconsistent requirements, and unexpressible repairs. It then uses independently authored faulty policies and held-out requirements grouped by scenario family. Mutation history may support diagnosis checks, but it is not treated as proof that one repair is uniquely correct.",
                        "Core comparisons share the interpreter, repair grammar, objective, evidence, solver, validator, and wall-clock budget: full-space symbolic synthesis; inexpensive ordered dependency analysis; spectrum or coverage localization; random scopes; and intervention guidance. The primary endpoint is hidden qualified repair rate: all hidden hard requirements pass and a predeclared legitimate-use floor is met. Secondary measures include unsafe allows, false denials, ask fidelity, permission drift, patch size, latency, solver effort, and the fraction of useful repairs outside preferred scopes.",
                        "A small full-agent study compares the original, direct-repair, and guided-repair policies on benign and adversarial tasks. Task completion, unsafe effects, approvals, latency, and alternative paths are reported separately from snapshot authorization accuracy.",
                    ),
                ),
                Section(
                    "Expected contributions and limits",
                    (
                        "Expected contributions are: (i) a precise model of diagnosis-to-edit realizability for a bounded ordered policy language; (ii) a reproducible comparison showing where causal guidance helps, is neutral, or wastes budget; and (iii) an auditable repair prototype with explicit regression constraints. A negative result - that direct synthesis dominates within credible scales - remains informative but is not presented as a guaranteed publication outcome.",
                        "The guarantees are conditional on complete requirements, faithful policy semantics, and trusted evidence. Fixed-context replay does not predict every replanning behavior. Incomplete predicates can make a needed repair inexpressible, and multiple causes may be observationally indistinguishable. The study will not claim general causal discovery, universal safety, or deployment-scale assurance.",
                    ),
                ),
                Section(
                    "Selected references",
                    (
                        "[1] W. Eiers, G. Sankaran, and T. Bultan. Quantitative Policy Repair for Access Control on the Cloud. ISSTA, 2023. doi:10.1145/3597926.3598078.",
                        "[2] K. L. Wu, C. Jenkins, S. D. Stoller, and O. Chowdhury. Automatically Tightening Access Control Policies with Restricter. TACAS, 2026. doi:10.1007/978-3-032-22752-2_6.",
                        "[3] S. Mechtaev, J. Yi, and A. Roychoudhury. DirectFix: Looking for Simple Program Repairs. ICSE, 2015. doi:10.1109/ICSE.2015.63.",
                        "[4] H. Wang, C. M. Poskitt, and J. Sun. AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents. ICSE, 2026. arXiv:2503.18666.",
                        "[5] W. Eiers et al. Quantifying Permissiveness of Access Control Policies. ICSE, 2022. doi:10.1145/3510003.3510233.",
                    ),
                ),
            ),
        ),
    ),
    Proposal(
        filename="continuous-threat-model-maintenance-v1.0.pdf",
        title="Continuous Security Threat-Model Maintenance for Tool-Using Agents",
        short_title="Continuous Threat-Model Maintenance",
        subtitle="Keeping assumptions, conclusions, controls, and evidence current as agent systems evolve",
        tags=("Agent Security", "Threat Modeling", "Runtime Assurance", "Security Testing"),
        pages=(
            (
                Section(
                    "Research thesis",
                    (
                        "Tool-using agents change after deployment: tools are replaced, permissions are delegated or revoked, memory persists, models and prompts are updated, and external services alter behavior. A threat model created for an earlier configuration can silently retain conclusions whose assumptions or validation evidence are no longer current.",
                        "This proposal studies a runtime dependency model that links observable agent state to threat-model assumptions, threats, conclusions, controls, and tests. After a change, the system should identify the conclusions that require reassessment, preserve those that remain supported, and mark conclusions as unknown when the required evidence is missing or stale.",
                    ),
                ),
                Section(
                    "Problem and scope",
                    (
                        "The first version focuses on changes to tools, effective permissions, delegated authority, memory access, enforcement configuration, and model or prompt version. A change event is accepted only with a source, timestamp, artifact identity, and state version. The method does not infer safety from a trace-derived architecture diagram alone and does not assume that every relevant runtime change is observable.",
                        "A running example is a support agent that reads confidential records and sends notifications. Registering a new external destination is different from granting the agent authority to use it; changing an unrelated label should not invalidate the disclosure conclusion; and losing visibility into effective credentials should change the conclusion to unknown rather than safe.",
                    ),
                ),
                Section(
                    "Closest-work positioning",
                    (
                        "Run-time Threat Models already support continuous risk assessment through design-level and instance-level models.[1] Continuous threat-analysis pipelines and threat-model-driven testing also connect system evolution to reviewed threats and tests.[2][3] SAGA and ACE provide concrete agent security architectures whose policy, token, and execution state can serve as evidence.[4][5] The proposed distinction is a selective, evidence-aware maintenance procedure for agent-specific changes, not a claim to invent continuous threat modeling.",
                    ),
                ),
            ),
            (
                Section(
                    "Research questions",
                    (
                        bullet("RQ1.", "Which agent state properties and dependency relations are necessary to identify every reviewed conclusion and test affected by a change?"),
                        bullet("RQ2.", "Can selective reassessment match the relevant updates found by full reassessment while reducing unnecessary checks and reviewer effort?"),
                        bullet("RQ3.", "How should missing, delayed, conflicting, or stale observations change the status and explanation of a security conclusion?"),
                        bullet("RQ4.", "Which dependency patterns remain stable across agent frameworks, and which require framework-specific adapters or control evidence?"),
                    ),
                ),
                Section(
                    "Method",
                    (
                        bullet("1. Versioned security graph.", "Represent capabilities, tools, principals, permissions, data classes, memory stores, assumptions, threats, conclusions, controls, tests, and evidence as typed, versioned nodes. Edges record support, contradiction, mitigation, coverage, and dependence."),
                        bullet("2. Trusted observations.", "Collect configuration and authorization evidence through bounded adapters. Each observation carries source identity, collection time, version, freshness policy, and confidence state. Unsupported or missing facts remain explicit unknowns."),
                        bullet("3. Change impact semantics.", "Translate a state delta into affected graph predicates, propagate invalidation through declared dependencies, and produce one of three outcomes for each conclusion: supported, reassessment required, or unknown. New paths must be discovered from capability and authority changes rather than only from paths present in the original model."),
                        bullet("4. Evidence-aware test selection.", "Link each conclusion to validating controls and tests. Select tests whose assumptions or covered paths changed, while keeping prior results as historical evidence rather than treating them as current proof."),
                        bullet("5. Human-readable update receipt.", "For every change, report the observed event, affected assumptions, resulting conclusion status, selected tests, evidence age, and unresolved observation gaps. The explanation must distinguish a changed risk from a loss of knowledge."),
                    ),
                ),
                Section(
                    "Expected technical artifact",
                    (
                        "The prototype will include the typed graph schema, adapters for a small agent stack, an incremental update engine, a full-reassessment reference implementation, and a review interface that shows why each conclusion changed and which evidence would resolve an unknown state.",
                    ),
                ),
            ),
            (
                Section(
                    "Evaluation plan",
                    (
                        "Evaluation uses small reproducible agents with controlled changes to tools, destinations, permissions, memory, policies, and model configuration. Each scenario contains an initial state, a change event, a resulting state, independently reviewed expected effects, and the evidence available to the algorithm. Cases include irrelevant changes, newly enabled paths, revoked authority, stale tests, missing observations, and conflicting data sources.",
                        "Selective maintenance is compared with full reassessment, naive invalidate-all, dependency reachability without evidence semantics, and no update. Primary measures are missed affected conclusions, unnecessary invalidations, stale-evidence detection, unknown-state accuracy, update latency, and reviewer effort. Case-level disagreements and adjudication are retained; a limited scenario set is reported as a case study rather than population-level assurance.",
                        "A portability study implements the same change classes in two agent frameworks or orchestration styles. It measures which graph concepts remain unchanged, how much adapter-specific logic is required, and whether identical high-level changes produce consistent conclusion updates.",
                    ),
                ),
                Section(
                    "Expected contributions and limits",
                    (
                        "Expected contributions are: (i) agent-specific dependency semantics connecting runtime capability and authority changes to threat conclusions and evidence; (ii) an update procedure that handles stale and missing observations explicitly; and (iii) an empirical account of freshness, traceability, and reassessment cost. The work will not claim that maintaining a threat model automatically prevents attacks or improves downstream security outcomes without a separate causal study.",
                        "The method cannot detect changes outside its observation boundary. Incorrect dependency links can preserve a stale conclusion or trigger unnecessary review. Human reference judgments may disagree, and some changes may require new threat discovery rather than incremental maintenance. The initial prototype excludes arbitrary multi-agent concurrency and enterprise-scale asset inventories.",
                    ),
                ),
                Section(
                    "Selected references",
                    (
                        "[1] S. Verreydt, D. Van Landuyt, and W. Joosen. Run-time Threat Models for Systematic and Continuous Risk Assessment. Software and Systems Modeling, 2025. doi:10.1007/s10270-024-01242-5.",
                        "[2] L. Sion et al. Automated Threat Analysis and Management in a Continuous Integration Pipeline. IEEE SecDev, 2021. doi:10.1109/SecDev51306.2021.00021.",
                        "[3] M. Raciti, G. Bella, and D. Van Landuyt. Threat Model-Driven Test Framework for Security and Privacy of Agentic LLM Applications. IFIP SEC, 2026. doi:10.1007/978-3-032-27993-4_6.",
                        "[4] G. Syros et al. SAGA: A Security Architecture for Governing AI Agentic Systems. NDSS, 2026. doi:10.14722/ndss.2026.230869.",
                        "[5] E. Li et al. ACE: A Security Architecture for LLM-Integrated App Systems. NDSS, 2026. doi:10.14722/ndss.2026.230352.",
                    ),
                ),
            ),
        ),
    ),
    Proposal(
        filename="joint-authorization-transformed-artifacts-v1.0.pdf",
        title="Joint Authorization of Transformed Artifacts",
        short_title="Joint Artifact Authorization",
        subtitle="Preserving multi-owner security obligations across transformation and final release",
        tags=("Authorization", "Information Flow", "Multi-Principal Systems", "Provenance"),
        pages=(
            (
                Section(
                    "Research thesis",
                    (
                        "Agent workflows increasingly combine artifacts governed by different owners: a private dataset, a licensed model output, a partner document, or a user-approved message. Individual approvals can remain valid while a later join, projection, aggregation, or audience change makes the combined release unauthorized.",
                        "This proposal develops a restricted authorization calculus for transformed artifacts. The checker should either produce a preservation witness for the exact output and recipients, explain the smallest conflicting obligations, or identify the owners whose approval must be renewed. The aim is useful release control without treating every transformation as automatically safe or forcing global reapproval after every change.",
                    ),
                ),
                Section(
                    "Problem and scope",
                    (
                        "The first version uses immutable, content-addressed artifacts; issuer-scoped predicates; typed recipients; and a small transformation algebra covering projection, filtering, approved joins, and fixed aggregates. A release permit is bound to the output digest, transformation witness, recipient set, and policy snapshot. Free-form summarization, open-ended code execution, global distributed revocation, and unverifiable external transforms are outside the initial guarantee.",
                        "The trusted base includes owner identity and assignment, reviewed policies, transformation semantics, artifact hashing, the checker, and the final release gate. Provenance supplies evidence about derivation but does not by itself decide whether an owner authorizes the derived release.",
                    ),
                ),
                Section(
                    "Closest-work positioning",
                    (
                        "Decentralized information-flow labels already combine policies from mutually distrusting principals, and Fabric enforces such policies across distributed computation.[1][2] Multiparty access control addresses conflicts among stakeholders of a shared object, while SecPAL provides a formal language for decentralized authorization and delegation.[3][4] Whole-system provenance records data transformations but does not by itself define approval preservation.[5] The intended gap is therefore transformation-sensitive preservation and renewal for one concrete final artifact, not generic policy conjunction, provenance capture, or distributed IFC.",
                    ),
                ),
            ),
            (
                Section(
                    "Research questions",
                    (
                        bullet("RQ1.", "Which owner obligations are preserved by projection, filtering, approved joins, and fixed aggregates, and which transformations require issuer-specific renewal?"),
                        bullet("RQ2.", "Can a checker safely authorize more useful releases than policy intersection or mandatory global renewal while preserving every owner's declared constraint?"),
                        bullet("RQ3.", "What is the smallest conflict or missing-evidence explanation that enables a user or owner to revise a workflow without weakening unrelated policies?"),
                    ),
                ),
                Section(
                    "Method",
                    (
                        bullet("1. Artifact and policy model.", "Represent each artifact by a digest, schema, owner set, provenance edges, and issuer-scoped obligations over fields, purposes, audiences, transformations, and validity conditions. Policies are immutable within one checking transaction."),
                        bullet("2. Typed transformation algebra.", "Give each supported transform a declared semantic rule. Projection can remove obligations tied only to removed fields; filtering preserves obligations on retained records; joins combine owner constraints; fixed aggregates may discharge row-level restrictions only under explicit threshold and audience conditions."),
                        bullet("3. Obligation propagation.", "Compute the obligations that survive a transformation path, retain issuer identity, and record which rule discharged or strengthened each condition. Unsupported transforms yield unknown rather than implicit permission."),
                        bullet("4. Release checking.", "Bind the output digest and recipients to a permit only when every surviving obligation is satisfied. Otherwise return a minimal conflicting obligation set, missing evidence, or a renewal request addressed only to the affected issuers."),
                        bullet("5. Conditional results.", "For the restricted algebra, state and prove preservation lemmas under explicit assumptions about transformation correctness and artifact binding. Mechanized checks are added where feasible; empirical evaluation does not substitute for the declared proof obligations."),
                    ),
                ),
                Section(
                    "Expected technical artifact",
                    (
                        "The prototype will include a compact policy language, transformation-witness format, obligation propagator, release checker, conflict explainer, and reproducible workflow fixtures. Each decision produces a receipt containing the input digests, transform chain, policy versions, recipients, discharged obligations, and unresolved conditions.",
                    ),
                ),
            ),
            (
                Section(
                    "Evaluation plan",
                    (
                        "The evaluation uses workflows in which independently governed artifacts are projected, filtered, joined, and aggregated before release. Scenarios cover compatible policies, audience expansion, purpose mismatch, owner conflicts, stale approval, transformed-field removal, threshold aggregation, unsupported transforms, and evidence loss. Policies and expected outcomes are reviewed before running the checker.",
                        "Baselines are plain policy intersection, renewal after every transformation, global owner voting, and strong handwritten release rules. Primary measures are unauthorized releases, useful authorized completion, approval burden, false renewal requests, explanation size, checker latency, and policy-authoring effort. Mutation tests target artifact substitution, recipient changes, missing transforms, reordered witnesses, and stale policy snapshots.",
                        "Ablations remove issuer identity, exact output binding, provenance links, and transformation-specific rules. These tests determine whether the proposed precision comes from the claimed mechanisms or merely from a more permissive policy set.",
                    ),
                ),
                Section(
                    "Expected contributions and limits",
                    (
                        "Expected contributions are: (i) a restricted semantics for multi-owner obligations over transformed artifacts; (ii) a checker that returns preservation witnesses, minimal conflicts, or scoped renewal requests; and (iii) evidence about the security-utility trade-off against conservative baselines. The central success criterion is safe additional utility over global renewal, not policy-language novelty alone.",
                        "Guarantees depend on correct owner assignment, truthful transformation witnesses, faithful transform semantics, collision-resistant artifact binding, and a mediated release gate. The first version does not prove the semantics of arbitrary model-generated summaries, repair compromised hosts, or solve global revocation. If conventional decentralized label joins match the checker on all credible cases, the proposed specialization is not justified.",
                    ),
                ),
                Section(
                    "Selected references",
                    (
                        "[1] A. C. Myers and B. Liskov. Complete, Safe Information Flow with Decentralized Labels. IEEE Symposium on Security and Privacy, 1998.",
                        "[2] J. Liu et al. Fabric: A Platform for Secure Distributed Computation and Storage. SOSP, 2009. doi:10.1145/1629575.1629594.",
                        "[3] H. Hu, G.-J. Ahn, and J. Jorgensen. Multiparty Access Control for Online Social Networks: Model and Mechanisms. IEEE TKDE, 2013. doi:10.1109/TKDE.2012.97.",
                        "[4] M. Y. Becker, C. Fournet, and A. D. Gordon. SecPAL: Design and Semantics of a Decentralized Authorization Language. Journal of Computer Security, 2010. doi:10.3233/JCS-2009-0364.",
                        "[5] T. F. J.-M. Pasquier et al. Practical Whole-System Provenance Capture. ACM SoCC, 2017. doi:10.1145/3127479.3129249.",
                    ),
                ),
            ),
        ),
    ),
)


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "ProposalTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=21,
            leading=24,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=5 * mm,
        ),
        "subtitle": ParagraphStyle(
            "ProposalSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=14,
            textColor=MUTED,
            spaceAfter=4 * mm,
        ),
        "meta": ParagraphStyle(
            "ProposalMeta",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=MUTED,
        ),
        "heading": ParagraphStyle(
            "SectionHeading",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=14,
            textColor=INK,
            spaceBefore=4.5 * mm,
            spaceAfter=1.8 * mm,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.4,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=2.1 * mm,
        ),
        "reference": ParagraphStyle(
            "Reference",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=7.4,
            leading=9.2,
            textColor=MUTED,
            leftIndent=4 * mm,
            firstLineIndent=-4 * mm,
            spaceAfter=1.1 * mm,
        ),
        "tag": ParagraphStyle(
            "Tag",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9,
            textColor=ACCENT,
            alignment=TA_CENTER,
        ),
    }


def tag_table(tags: Iterable[str], style: ParagraphStyle) -> Table:
    cells = [[Paragraph(tag, style) for tag in tags]]
    widths = [max(28 * mm, (stringWidth(tag, "Helvetica-Bold", 7.5) + 9 * mm)) for tag in tags]
    table = Table(cells, colWidths=widths, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C8D6FF")),
                ("INNERGRID", (0, 0), (-1, -1), 2.5, PAPER),
                ("LEFTPADDING", (0, 0), (-1, -1), 3.5 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3.5 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 1.6 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6 * mm),
            ]
        )
    )
    return table


def draw_page(canvas, doc, proposal: Proposal) -> None:
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(doc.leftMargin, height - 14 * mm, width - doc.rightMargin, height - 14 * mm)
    canvas.setFont("Helvetica-Bold", 7.2)
    canvas.setFillColor(ACCENT)
    canvas.drawString(doc.leftMargin, height - 11.2 * mm, "RESEARCH PROPOSAL")
    canvas.setFont("Helvetica", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(width - doc.rightMargin, height - 11.2 * mm, proposal.short_title)
    canvas.line(doc.leftMargin, 13 * mm, width - doc.rightMargin, 13 * mm)
    canvas.setFont("Helvetica", 7.2)
    canvas.drawString(doc.leftMargin, 8.7 * mm, "Parsa Oryani | Public version 1.0 | 29 October 2026")
    canvas.drawRightString(width - doc.rightMargin, 8.7 * mm, f"{canvas.getPageNumber()} / 3")
    canvas.restoreState()


def build_proposal(proposal: Proposal) -> Path:
    output_path = OUTPUT_DIR / proposal.filename
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet = styles()
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=20 * mm,
        bottomMargin=18 * mm,
        title=proposal.title,
        author="Parsa Oryani",
        subject="Public research proposal",
        creator="Parsa Oryani research portfolio",
    )
    story = []
    for page_number, page_sections in enumerate(proposal.pages):
        if page_number == 0:
            story.append(Spacer(1, 2 * mm))
            story.append(Paragraph(proposal.title, sheet["title"]))
            story.append(Paragraph(proposal.subtitle, sheet["subtitle"]))
            story.append(tag_table(proposal.tags, sheet["tag"]))
            story.append(Spacer(1, 3.5 * mm))
            story.append(
                Paragraph(
                    "<b>Parsa Oryani</b> | Sharif University of Technology | "
                    "Research interests: secure and trustworthy agentic AI",
                    sheet["meta"],
                )
            )
            story.append(Spacer(1, 2.5 * mm))
        for section in page_sections:
            story.append(Paragraph(section.heading, sheet["heading"]))
            paragraph_style = sheet["reference"] if section.heading == "Selected references" else sheet["body"]
            for paragraph in section.paragraphs:
                story.append(Paragraph(paragraph, paragraph_style))
        if page_number < len(proposal.pages) - 1:
            story.append(PageBreak())
    doc.build(
        story,
        onFirstPage=lambda canvas, current_doc: draw_page(canvas, current_doc, proposal),
        onLaterPages=lambda canvas, current_doc: draw_page(canvas, current_doc, proposal),
    )
    return output_path


def main() -> None:
    for proposal in PROPOSALS:
        print(build_proposal(proposal))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build and validate the public CV PDF from the canonical Markdown CV."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "CV.md"
OUTPUT = ROOT / "public" / "cv.pdf"

REQUIRED_TEXT = (
    "Parsa Oryani",
    "parsa.oryani82@sharif.edu",
    "Security of LLM agents and multi-agent systems",
    "Sep 2025 - Present",
    "Sep 2020 - Feb 2025",
    "Design and Analysis of Algorithms",
    "ZK-Mixer: Regulated Anonymous Payments",
    "Ethereum CLI (Sepolia Testnet)",
    "BRCC: Besu Research Control Center",
)

FORBIDDEN_TEXT = (
    "parsa.oryani@gmail.com",
    "highest grade in both",
)


def run(*command: str) -> str:
    result = subprocess.run(command, cwd=ROOT, check=True, text=True, capture_output=True)
    return result.stdout


def build() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    generated = OUTPUT.with_suffix(".generated.pdf")
    run(
        "pandoc",
        str(SOURCE),
        "--from=gfm+hard_line_breaks",
        "--pdf-engine=tectonic",
        "--variable=papersize:a4",
        "--variable=geometry:margin=1.05cm",
        "--variable=fontsize:8pt",
        "--variable=linestretch:0.88",
        "--variable=colorlinks:true",
        "--variable=linkcolor:blue",
        "--output",
        str(generated),
    )

    reader = PdfReader(generated)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.add_metadata(
        {
            "/Title": "Parsa Oryani — Curriculum Vitae",
            "/Author": "Parsa Oryani",
            "/Subject": "Computer Security and AI Agent Security",
        }
    )
    with OUTPUT.open("wb") as destination:
        writer.write(destination)
    generated.unlink()


def validate() -> None:
    if not OUTPUT.exists():
        raise SystemExit(f"Missing PDF: {OUTPUT}")

    text = run("pdftotext", "-layout", str(OUTPUT), "-")
    normalized = " ".join(text.replace("–", "-").split())
    for required in REQUIRED_TEXT:
        candidate = " ".join(required.replace("–", "-").split())
        if candidate not in normalized:
            raise SystemExit(f"PDF is missing required text: {required}")
    for forbidden in FORBIDDEN_TEXT:
        if forbidden.lower() in normalized.lower():
            raise SystemExit(f"PDF contains forbidden text: {forbidden}")

    info = run("pdfinfo", str(OUTPUT))
    pages_line = next(line for line in info.splitlines() if line.startswith("Pages:"))
    pages = int(pages_line.split(":", 1)[1].strip())
    if not 1 <= pages <= 2:
        raise SystemExit(f"Expected a readable one- or two-page CV, found {pages} pages")
    if "Title:           Parsa Oryani" not in info or "Author:          Parsa Oryani" not in info:
        raise SystemExit("PDF title/author metadata is missing")
    print(f"CV PDF validated: {pages} page(s), critical facts aligned")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Validate without rebuilding")
    args = parser.parse_args()
    if not args.check:
        build()
    validate()


if __name__ == "__main__":
    main()

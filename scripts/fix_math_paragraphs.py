#!/usr/bin/env python3
"""Move block math out of <p> tags into .math-passage wrappers."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

P_WITH_MATH = re.compile(
    r"<p(\s[^>]*)?>(.*?)</p>",
    re.DOTALL | re.IGNORECASE,
)


def split_paragraph(inner: str) -> str | None:
    if '<div class="math-block">' not in inner:
        return None

    parts = re.split(r'(<div class="math-block">.*?</div>)', inner, flags=re.DOTALL)
    segments = [p.strip() for p in parts if p.strip()]
    if not segments:
        return None

    blocks: list[str] = []
    for seg in segments:
        if seg.startswith('<div class="math-block">'):
            blocks.append(f"      {seg}\n")
        else:
            cls = "math-gloss" if seg.lower().startswith("where ") else "math-lead"
            blocks.append(f'      <p class="{cls}">{seg}</p>\n')

    return "      <div class=\"math-passage\">\n" + "".join(blocks) + "      </div>\n"


def refactor_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    def repl(match: re.Match[str]) -> str:
        attrs = match.group(1) or ""
        inner = match.group(2)
        if "math-block" not in inner:
            return match.group(0)
        # Skip SVG / diagram paragraphs
        if "<svg" in inner or "<polygon" in inner:
            return match.group(0)
        rebuilt = split_paragraph(inner)
        return rebuilt if rebuilt else match.group(0)

    text = P_WITH_MATH.sub(repl, text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if refactor_file(p)]
    print(f"Updated {len(changed)} files")


if __name__ == "__main__":
    main()

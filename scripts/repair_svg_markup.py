#!/usr/bin/env python3
"""Repair corrupted SVG text tags (fill="#2C2416#FAF6EF...).</text>)."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Merged fill swallowed label text: fill="#2C2416#FAF6EFLabel</text>
CORRUPT_TEXT = re.compile(
    r'(<text\b[^>]*?\s)fill="#2C2416#FAF6EF([^<]*)</text>',
    re.IGNORECASE,
)

# Same corruption without prior attrs
CORRUPT_TEXT_ALT = re.compile(
    r'(<text\b\s*)fill="#2C2416#FAF6EF([^<]*)</text>',
    re.IGNORECASE,
)

ACCENT_RECT = re.compile(
    r'fill="(?:#8FAF8A|#D4A5A0|#C9A84C|var\(--color-mint\)|var\(--color-pink\)|var\(--color-coral\)|var\(--accent-sage\)|var\(--accent-rose\)|var\(--accent-mustard\)|var\(--color-mustard\))"',
    re.IGNORECASE,
)


def accent_context_before(svg: str, pos: int) -> bool:
    chunk = svg[max(0, pos - 800) : pos]
    rects = list(ACCENT_RECT.finditer(chunk))
    return bool(rects) and (pos - rects[-1].end() < 400)


def repair_text_tag(match: re.Match[str], svg: str) -> str:
    prefix = match.group(1)
    label = match.group(2).strip()
    pos = match.start()
    fill = "#FAF6EF" if accent_context_before(svg, pos) else "#2C2416"
    if 'text-anchor=' not in prefix:
        prefix = prefix.rstrip() + ' text-anchor="middle"'
    if 'dominant-baseline=' not in prefix:
        prefix = prefix + ' dominant-baseline="central"'
    return f'{prefix} fill="{fill}">{label}</text>'


def repair_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    def sub_corrupt(m: re.Match[str]) -> str:
        return repair_text_tag(m, text)

    text = CORRUPT_TEXT.sub(sub_corrupt, text)
    text = CORRUPT_TEXT_ALT.sub(sub_corrupt, text)

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if repair_file(p)]
    print(f"Repaired {len(changed)} files")


if __name__ == "__main__":
    main()

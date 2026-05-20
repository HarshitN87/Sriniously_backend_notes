#!/usr/bin/env python3
"""Fix SVG text/label contrast on light diagram plates."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LIGHT_FILLS = {
    "#faf6ef",
    "#f5f0e8",
    "#ffffff",
    "#fff",
    "var(--bg-cream)",
    "var(--bg-sand)",
    "var(--bg-code)",
    "var(--bg-node)",
}
ACCENT_FILLS = {
    "#8faf8a",
    "#d4a5a0",
    "var(--color-mint)",
    "var(--color-pink)",
    "var(--color-coral)",
    "var(--accent-sage)",
    "var(--accent-rose)",
    "var(--accent-mustard)",
    "var(--color-mustard)",
    "#c9a84c",
}
INK = "#2C2416"
ON_ACCENT = "#FAF6EF"

RECT_RE = re.compile(
    r"<rect\b([^>]*)/?>",
    re.IGNORECASE,
)
ATTR_RE = re.compile(r'(\w+)="([^"]*)"')
TEXT_RE = re.compile(
    r'(<text\b[^>]*\bx="(?P<x>\d+(?:\.\d+)?)"[^>]*\by="(?P<y>\d+(?:\.\d+)?)"[^>]*\bfill=")(?P<fill>[^"]+)("[^>]*>)',
    re.IGNORECASE,
)


def parse_rect(tag: str) -> tuple[float, float, float, float, str] | None:
    attrs = {m[0]: m[1] for m in ATTR_RE.finditer(tag)}
    for key in ("x", "y", "width", "height", "fill"):
        if key not in attrs:
            return None
    return (
        float(attrs["x"]),
        float(attrs["y"]),
        float(attrs["width"]),
        float(attrs["height"]),
        attrs["fill"],
    )


def normalize_fill(fill: str) -> str:
    return fill.strip().lower()


def rect_for_text(
    rects: list[tuple[float, float, float, float, str]], tx: float, ty: float
) -> str | None:
    matches = [
        (x, y, w, h, f)
        for x, y, w, h, f in rects
        if y <= ty <= y + h + 4 and x <= tx <= x + w
    ]
    if not matches:
        return None
    # smallest area = innermost box
    matches.sort(key=lambda t: t[2] * t[3])
    return matches[0][4]


def fix_svg(svg: str) -> str:
    rects = []
    for m in RECT_RE.finditer(svg):
        parsed = parse_rect(m.group(0))
        if parsed:
            rects.append(parsed)

    def repl_text(m: re.Match[str]) -> str:
        tx = float(m["x"])
        ty = float(m["y"])
        fill = m["fill"]
        nf = normalize_fill(fill)

        parent = rect_for_text(rects, tx, ty)
        if parent:
            pf = normalize_fill(parent)
            if pf in {normalize_fill(x) for x in LIGHT_FILLS}:
                new_fill = INK
            elif pf in {normalize_fill(x) for x in ACCENT_FILLS}:
                new_fill = ON_ACCENT
            else:
                new_fill = INK
        else:
            if nf in {normalize_fill(ON_ACCENT), "#faf6ef"}:
                new_fill = INK
            else:
                return m.group(0)

        if normalize_fill(new_fill) == nf:
            return m.group(0)
        return f"{m.group(1)}{new_fill}{m.group(4)}"

    return TEXT_RE.sub(repl_text, svg)


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    def repl_svg(m: re.Match[str]) -> str:
        return fix_svg(m.group(0))

    text = re.sub(
        r'<svg class="svg-diagram"[\s\S]*?</svg>',
        repl_svg,
        text,
        flags=re.IGNORECASE,
    )

    text = text.replace('fill="var(--bg-sand)"', 'fill="#F5F0E8"')
    text = text.replace("fill='var(--bg-sand)'", "fill='#F5F0E8'")

    if text != original:
        path.write_text(text, encoding="utf-8", newline="\n")
        return True
    return False


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if fix_file(p)]
    print(f"Updated {len(changed)} files")


if __name__ == "__main__":
    main()
